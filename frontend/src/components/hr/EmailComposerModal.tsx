import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Paperclip,
  Trash2,
  Download,
  Eye,
  Plus,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { http } from '@/api/client';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormControls';
import type { Candidate } from '@/types';

interface EmailComposerModalProps {
  open: boolean;
  onClose: () => void;
  candidate: Candidate;
  onSuccess: (updatedCandidate: Candidate) => void;
}

interface HRConfig {
  senderName: string;
  senderEmail: string;
  defaultCc: string;
  replyTo: string;
  companyName: string;
  website: string;
}

export function EmailComposerModal({ open, onClose, candidate, onSuccess }: EmailComposerModalProps) {
  const [config, setConfig] = useState<HRConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Form Fields
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('Offer of Employment – Software Developer');
  const [ccHr, setCcHr] = useState(true);

  // Attachment Options
  const [attachOfferLetter, setAttachOfferLetter] = useState(true);
  const [replacingFile, setReplacingFile] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  
  // Local state for candidate (to track fresh attachment list)
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>(candidate);

  // Editor states
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorInit, setEditorInit] = useState(false);

  // Saving/Sending states
  const [savingDraft, setSavingDraft] = useState(false);
  const [sending, setSending] = useState(false);

  // Load config
  useEffect(() => {
    if (open) {
      setLoadingConfig(true);
      http.get('/admin/hr/config')
        .then((res) => {
          if (res.data && res.data.success) {
            setConfig(res.data.data);
          }
        })
        .catch((err) => {
          console.error('Failed to load HR Config', err);
          toast.error('Failed to load email configurations');
        })
        .finally(() => {
          setLoadingConfig(false);
        });
    }
  }, [open]);

  // Sync draft fields or defaults
  useEffect(() => {
    if (open && config) {
      setCurrentCandidate(candidate);
      
      const hasDraft = candidate.draft && (candidate.draft.subject || candidate.draft.body);
      
      setTo(hasDraft && candidate.draft ? candidate.draft.to : candidate.email);
      setBcc(hasDraft && candidate.draft ? candidate.draft.bcc : '');
      setSubject(hasDraft && candidate.draft ? candidate.draft.subject : 'Offer of Employment – Software Developer');
      
      const initialCc = hasDraft && candidate.draft ? candidate.draft.cc : config.defaultCc;
      setCc(initialCc);
      setCcHr(initialCc.includes(config.defaultCc));
      setAttachOfferLetter(true);
      setEditorInit(false);
    }
  }, [open, config, candidate]);

  // Handle CC HR checkbox
  const handleCcHrToggle = (checked: boolean) => {
    setCcHr(checked);
    if (!config) return;

    const hrEmail = config.defaultCc;
    let ccEmails = cc.split(',').map(e => e.trim()).filter(Boolean);

    if (checked) {
      if (!ccEmails.includes(hrEmail)) {
        ccEmails.unshift(hrEmail);
      }
    } else {
      ccEmails = ccEmails.filter(e => e !== hrEmail);
    }
    setCc(ccEmails.join(', '));
  };

  // Pre-filled template body generator
  const defaultBody = useMemo(() => {
    return `
      <p>Dear ${currentCandidate.fullName},</p>
      <p>Congratulations!</p>
      <p>Please find your Offer Letter attached for your review.</p>
      <p>We are delighted to welcome you to NeoSix Technologies and look forward to working with you.</p>
      <p>For any enquiry send mail to notification@neosix.in.</p>
      <p>We wish you every success and look forward to having you on our team.</p>
      <br>
      <p>Regards,</p>
      <p><strong>Aditya Dhirendra Singh</strong><br>Founder & Proprietor<br>NeoSix Technologies</p>
    `;
  }, [currentCandidate.fullName]);

  // Set initial content for Rich Text Editor
  useEffect(() => {
    if (open && editorRef.current && !editorInit) {
      const initialContent = currentCandidate.draft?.body || defaultBody;
      editorRef.current.innerHTML = initialContent;
      setEditorInit(true);
    }
  }, [open, editorInit, currentCandidate.draft, defaultBody]);

  // Calculate size validation (Limit: 10MB)
  const totalAttachmentsSize = useMemo(() => {
    let size = 0;
    if (attachOfferLetter && currentCandidate.offerLetter && currentCandidate.offerLetter.size) {
      size += currentCandidate.offerLetter.size;
    }
    if (currentCandidate.draft?.attachments) {
      currentCandidate.draft.attachments.forEach(att => {
        size += att.size;
      });
    }
    return size;
  }, [attachOfferLetter, currentCandidate.offerLetter, currentCandidate.draft?.attachments]);

  const sizeLimitExceeded = totalAttachmentsSize > 10 * 1024 * 1024;

  // Format bytes for display
  const formatBytes = (bytes: number | null) => {
    if (bytes === null || bytes === undefined) return '0 Bytes';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Custom rich text formatting triggers
  const format = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const addLink = () => {
    const url = prompt('Enter the link URL:');
    if (url) {
      format('createLink', url);
    }
  };

  // Replace Offer Letter PDF
  const handleReplaceOfferLetter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    setReplacingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const cId = currentCandidate.id || (currentCandidate as any)._id;
      const res = await http.post(`/admin/hr/candidates/${cId}/offer-letter`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.success) {
        setCurrentCandidate(res.data.data);
        toast.success('Offer letter PDF replaced successfully');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to replace offer letter';
      toast.error(msg);
    } finally {
      setReplacingFile(false);
    }
  };

  // Upload Additional Attachment
  const handleUploadAdditional = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    setUploadingAdditional(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const cId = currentCandidate.id || (currentCandidate as any)._id;
      const res = await http.post(`/admin/hr/candidates/${cId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.success) {
        setCurrentCandidate(res.data.data);
        toast.success('Attachment added successfully');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to add attachment';
      toast.error(msg);
    } finally {
      setUploadingAdditional(false);
    }
  };

  // Delete Additional Attachment
  const handleDeleteAdditional = async (index: number) => {
    try {
      const cId = currentCandidate.id || (currentCandidate as any)._id;
      const res = await http.delete(`/admin/hr/candidates/${cId}/attachments/${index}`);
      if (res.data && res.data.success) {
        setCurrentCandidate(res.data.data);
        toast.success('Attachment removed');
      }
    } catch (err: any) {
      toast.error('Failed to remove attachment');
    }
  };

  // Preview PDFs
  const handlePreviewPdf = (urlPath: string) => {
    const cId = currentCandidate.id || (currentCandidate as any)._id;
    const url = `${import.meta.env.VITE_API_URL}/admin/hr/candidates/${cId}/offer-letter/preview`;
    window.open(url, '_blank');
  };

  // Save Draft action
  const handleSaveDraft = async () => {
    setSavingDraft(true);
    const bodyContent = editorRef.current?.innerHTML || '';

    try {
      const cId = currentCandidate.id || (currentCandidate as any)._id;
      const res = await http.post(`/admin/hr/candidates/${cId}/draft`, {
        to,
        cc,
        bcc,
        subject,
        body: bodyContent,
        attachments: currentCandidate.draft?.attachments || [],
      });

      if (res.data && res.data.success) {
        toast.success('Draft email saved successfully');
        onSuccess(res.data.data);
        onClose();
      }
    } catch (err: any) {
      toast.error('Failed to save draft');
    } finally {
      setSavingDraft(false);
    }
  };

  // Send Email action
  const handleSendEmail = async () => {
    if (!to) {
      toast.error('Recipient email (TO) is required');
      return;
    }
    if (sizeLimitExceeded) {
      toast.error('Attachments size exceeds Resend limit of 10MB');
      return;
    }

    setSending(true);
    const bodyContent = editorRef.current?.innerHTML || '';

    try {
      const cId = currentCandidate.id || (currentCandidate as any)._id;
      const res = await http.post(`/admin/hr/candidates/${cId}/send-offer`, {
        to,
        cc,
        bcc,
        subject,
        body: bodyContent,
        attachOfferLetter,
        additionalAttachments: currentCandidate.draft?.attachments || [],
      });

      if (res.data && res.data.success) {
        toast.success('Offer letter email sent successfully!');
        onSuccess(res.data.data.candidate);
        onClose();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send email. Draft has been preserved.';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!sending && !savingDraft) onClose();
      }}
      title={`Send Offer Letter — ${currentCandidate.fullName}`}
      size="xl"
    >
      {loadingConfig ? (
        <div className="flex h-48 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600/30 border-t-primary-600" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Header configuration info */}
          <div className="rounded-lg bg-mist-50 p-4 border border-neutral-100">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">From</span>
              <span className="text-sm font-semibold text-heading">
                {config ? `${config.senderName} <${config.senderEmail}>` : 'Aditya Dhirendra Singh <aditya@neosix.in>'}
              </span>
            </div>
          </div>

          {/* Recipients Row */}
          <div className="space-y-3">
            <Input
              label="To (Recipients, comma separated)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="candidate@email.com, cc@email.com"
              required
              disabled={sending}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Cc (Carbon Copy)"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="optional@email.com"
                disabled={sending}
              />
              <Input
                label="Bcc (Blind Carbon Copy)"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="bcc@email.com"
                disabled={sending}
              />
            </div>

            {/* Checkbox for CC HR */}
            <div className="flex items-center gap-2">
              <input
                id="cc-hr-checkbox"
                type="checkbox"
                checked={ccHr}
                onChange={(e) => handleCcHrToggle(e.target.checked)}
                disabled={sending}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="cc-hr-checkbox" className="text-xs font-semibold text-neutral-600 cursor-pointer">
                Cc HR ({config?.defaultCc || 'hr@neosix.in'})
              </label>
            </div>

            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Offer of Employment – Software Developer"
              required
              disabled={sending}
            />
          </div>

          {/* WYSIWYG Editor Toolbar */}
          <div className="flex flex-col border border-neutral-200 rounded-btn overflow-hidden">
            <div className="flex flex-wrap gap-1 bg-neutral-50 border-b border-neutral-200 p-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('bold')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Bold"
              >
                <BoldIcon size={16} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('italic')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Italic"
              >
                <ItalicIcon size={16} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('underline')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Underline"
              >
                <UnderlineIcon size={16} />
              </button>

              <div className="h-6 w-px bg-neutral-300 my-auto mx-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('formatBlock', '<h1>')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700 font-bold"
                title="Heading 1"
              >
                <Heading1 size={16} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('formatBlock', '<h2>')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700 font-semibold"
                title="Heading 2"
              >
                <Heading2 size={16} />
              </button>

              <div className="h-6 w-px bg-neutral-300 my-auto mx-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('insertUnorderedList')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Bullet List"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('insertOrderedList')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </button>

              <div className="h-6 w-px bg-neutral-300 my-auto mx-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('justifyLeft')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Align Left"
              >
                <AlignLeft size={16} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('justifyCenter')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Align Center"
              >
                <AlignCenter size={16} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => format('justifyRight')}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Align Right"
              >
                <AlignRight size={16} />
              </button>

              <div className="h-6 w-px bg-neutral-300 my-auto mx-1" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={addLink}
                className="p-2 rounded hover:bg-neutral-200 text-neutral-700"
                title="Insert Link"
              >
                <LinkIcon size={16} />
              </button>
            </div>

            {/* Content editable body area */}
            <div
              ref={editorRef}
              contentEditable
              className="p-5 min-h-[220px] max-h-[350px] overflow-y-auto outline-none prose prose-sm max-w-none text-heading"
              style={{ minHeight: '220px' }}
            />
          </div>

          {/* Attachment Management Section */}
          <div className="space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Attachments ({attachOfferLetter ? '1' : '0'} Offer Letter, {currentCandidate.draft?.attachments?.length || 0} additional) — Total: {formatBytes(totalAttachmentsSize)}
            </span>

            {/* Size Validation Notice */}
            {sizeLimitExceeded && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-xs text-red-600 border border-red-200">
                <AlertTriangle size={16} className="shrink-0" />
                <span>
                  <strong>Warning:</strong> Total attachment size exceeds Resend's 10MB limit. The email will fail to send until you remove or replace files.
                </span>
              </div>
            )}

            {/* List of Attachments */}
            <div className="space-y-2">
              {/* Default Offer Letter PDF */}
              {currentCandidate.offerLetter && currentCandidate.offerLetter.path ? (
                <div className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 p-3 bg-white hover:bg-mist-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={attachOfferLetter}
                      onChange={(e) => setAttachOfferLetter(e.target.checked)}
                      disabled={sending}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <Paperclip size={16} className="text-primary-500 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold text-heading truncate max-w-[250px] sm:max-w-[400px]">
                        {currentCandidate.offerLetter.originalName || 'Offer-Letter.pdf'}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {formatBytes(currentCandidate.offerLetter.size)} (Offer Letter)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handlePreviewPdf(currentCandidate.offerLetter!.path!)}
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-500 hover:text-heading"
                      title="Preview PDF"
                    >
                      <Eye size={14} />
                    </button>
                    <a
                      href={`${import.meta.env.VITE_API_URL}/admin/hr/candidates/${currentCandidate.id || (currentCandidate as any)._id}/offer-letter/download`}
                      download
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-500 hover:text-heading"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </a>
                    
                    {/* Replace file input */}
                    <label className="p-1.5 rounded hover:bg-neutral-200 text-neutral-500 hover:text-heading cursor-pointer inline-flex items-center" title="Replace PDF">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleReplaceOfferLetter}
                        disabled={replacingFile || sending}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-neutral-300 p-4 text-center bg-mist-50/50">
                  <span className="text-xs text-neutral-500">
                    No main Offer Letter PDF uploaded. You can send without one or upload one in the main candidate details card.
                  </span>
                </div>
              )}

              {/* Additional PDF Attachments */}
              {currentCandidate.draft?.attachments?.map((att, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 p-3 bg-white hover:bg-mist-50 transition-colors"
                >
                  <div className="flex items-center gap-3 pl-7">
                    <Paperclip size={16} className="text-neutral-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-semibold text-heading truncate max-w-[250px] sm:max-w-[400px]">
                        {att.originalName}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {formatBytes(att.size)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={`${import.meta.env.VITE_API_URL}/admin/hr/candidates/${currentCandidate.id || (currentCandidate as any)._id}/offer-letter/download?path=${encodeURIComponent(att.path)}`}
                      download
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-500 hover:text-heading"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteAdditional(index)}
                      className="p-1.5 rounded hover:bg-neutral-200 text-red-500 hover:bg-red-50"
                      title="Remove Attachment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Button to Upload Additional Attachments */}
            <div className="flex justify-start">
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 cursor-pointer bg-primary-50 px-3 py-1.5 rounded-md hover:bg-primary-100 transition-colors border border-primary-200">
                <Plus size={14} />
                <span>Attach Additional PDF</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleUploadAdditional}
                  disabled={uploadingAdditional || sending}
                  className="sr-only"
                />
              </label>
              {(replacingFile || uploadingAdditional) && (
                <span className="text-xs text-neutral-400 ml-3 my-auto flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-400/30 border-t-neutral-400" />
                  Uploading file...
                </span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 mt-6">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={sending || savingDraft}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              loading={savingDraft}
              disabled={sending}
            >
              Save Draft
            </Button>
            <Button
              variant="primary"
              onClick={handleSendEmail}
              loading={sending}
              disabled={savingDraft || sizeLimitExceeded}
            >
              Send Email
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
