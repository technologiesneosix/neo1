import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  FileText,
  Mail,
  Download,
  Trash,
  RotateCcw,
  Paperclip,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Upload,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { http } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/FormControls';
import { Badge } from '@/components/ui/Badge';
import { EmailComposerModal } from '@/components/hr/EmailComposerModal';
import type { Candidate, EmailLog } from '@/types';

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Candidate Detail view
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Trash Bin / Restore Modal
  const [trashOpen, setTrashOpen] = useState(false);
  const [deletedCandidates, setDeletedCandidates] = useState<Candidate[]>([]);
  const [loadingTrash, setLoadingTrash] = useState(false);

  // Compose Modal
  const [composerOpen, setComposerOpen] = useState(false);
  const [candidateForEmail, setCandidateForEmail] = useState<Candidate | null>(null);

  // Add/Edit Candidate Modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Draft');
  const [savingCandidate, setSavingCandidate] = useState(false);

  // Offer Letter PDF Uploads
  const [uploadingPdfId, setUploadingPdfId] = useState<string | null>(null);
  
  // Resend log ID tracking
  const [resendingLogId, setResendingLogId] = useState<string | null>(null);

  // Detail Modal log view state
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [logDetailOpen, setLogDetailOpen] = useState(false);

  // Custom modal deletion confirm states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  const [candidateNameToDelete, setCandidateNameToDelete] = useState('');
  const [pdfDeleteConfirmOpen, setPdfDeleteConfirmOpen] = useState(false);
  const [candidateForPdfDelete, setCandidateForPdfDelete] = useState<string | null>(null);
  const [hardDeleteConfirmOpen, setHardDeleteConfirmOpen] = useState(false);
  const [candidateToHardDelete, setCandidateToHardDelete] = useState<string | null>(null);
  const [candidateNameToHardDelete, setCandidateNameToHardDelete] = useState('');

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await http.get('/admin/hr/candidates');
      if (res.data && res.data.success) {
        setCandidates(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to retrieve candidates list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Fetch email logs for candidate
  const fetchEmailLogs = async (candidateId: string) => {
    try {
      setLoadingLogs(true);
      const res = await http.get(`/admin/hr/email-logs?candidateId=${candidateId}`);
      if (res.data && res.data.success) {
        setEmailLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load candidate email logs', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Fetch trash bin candidates
  const fetchTrashCandidates = async () => {
    try {
      setLoadingTrash(true);
      const res = await http.get('/admin/hr/candidates/deleted');
      if (res.data && res.data.success) {
        setDeletedCandidates(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load trash list');
    } finally {
      setLoadingTrash(false);
    }
  };

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingCandidate(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setDesignation('');
    setNotes('');
    setStatus('Draft');
    setFormOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (candidate: Candidate, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening details
    setEditingCandidate(candidate);
    setFullName(candidate.fullName);
    setEmail(candidate.email);
    setPhone(candidate.phone || '');
    setDesignation(candidate.designation || '');
    setNotes(candidate.notes || '');
    setStatus(candidate.status);
    setFormOpen(true);
  };

  // Submit Add/Edit Form
  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error('Full Name and Email Address are required');
      return;
    }

    setSavingCandidate(true);
    const payload = { fullName, email, phone, designation, notes, status };

    try {
      let res;
      if (editingCandidate) {
        const cId = editingCandidate.id || (editingCandidate as any)._id;
        res = await http.put(`/admin/hr/candidates/${cId}`, payload);
      } else {
        res = await http.post('/admin/hr/candidates', payload);
      }

      if (res.data && res.data.success) {
        toast.success(editingCandidate ? 'Candidate updated' : 'Candidate created');
        fetchCandidates();
        setFormOpen(false);
        const vId = viewingCandidate?.id || (viewingCandidate as any)?._id;
        const eId = editingCandidate?.id || (editingCandidate as any)?._id;
        if (viewingCandidate && vId === eId) {
          setViewingCandidate(res.data.data);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save candidate';
      toast.error(msg);
    } finally {
      setSavingCandidate(false);
    }
  };

  // Trigger soft delete confirmation modal
  const handleDeleteCandidateTrigger = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCandidateToDelete(id);
    setCandidateNameToDelete(name);
    setDeleteConfirmOpen(true);
  };

  // Perform actual soft delete
  const executeDeleteCandidate = async () => {
    if (!candidateToDelete) return;
    try {
      const res = await http.delete(`/admin/hr/candidates/${candidateToDelete}`);
      if (res.data && res.data.success) {
        toast.success('Candidate moved to trash');
        fetchCandidates();
        const vId = viewingCandidate?.id || (viewingCandidate as any)?._id;
        if (vId === candidateToDelete) setViewingCandidate(null);
      }
    } catch (err) {
      toast.error('Failed to delete candidate');
    } finally {
      setDeleteConfirmOpen(false);
      setCandidateToDelete(null);
    }
  };

  // Restore Candidate
  const handleRestoreCandidate = async (id: string) => {
    try {
      const res = await http.post(`/admin/hr/candidates/${id}/restore`);
      if (res.data && res.data.success) {
        toast.success('Candidate restored successfully');
        fetchTrashCandidates();
        fetchCandidates();
      }
    } catch (err) {
      toast.error('Failed to restore candidate');
    }
  };

  // Upload/Replace Offer Letter PDF
  const handleUploadOfferLetter = async (candidateId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    setUploadingPdfId(candidateId);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await http.post(`/admin/hr/candidates/${candidateId}/offer-letter`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.success) {
        toast.success('Offer letter uploaded successfully');
        fetchCandidates();
        const vId = viewingCandidate?.id || (viewingCandidate as any)?._id;
        if (vId === candidateId) {
          setViewingCandidate(res.data.data);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to upload PDF';
      toast.error(msg);
    } finally {
      setUploadingPdfId(null);
    }
  };

  // Trigger PDF delete confirmation modal
  const handleDeleteOfferLetterTrigger = (candidateId: string) => {
    setCandidateForPdfDelete(candidateId);
    setPdfDeleteConfirmOpen(true);
  };

  // Perform actual PDF delete
  const executeDeleteOfferLetter = async () => {
    if (!candidateForPdfDelete) return;
    try {
      const res = await http.delete(`/admin/hr/candidates/${candidateForPdfDelete}/offer-letter`);
      if (res.data && res.data.success) {
        toast.success('Offer letter PDF deleted');
        fetchCandidates();
        const vId = viewingCandidate?.id || (viewingCandidate as any)?._id;
        if (vId === candidateForPdfDelete) {
          setViewingCandidate(res.data.data);
        }
      }
    } catch (err) {
      toast.error('Failed to delete offer letter PDF');
    } finally {
      setPdfDeleteConfirmOpen(false);
      setCandidateForPdfDelete(null);
    }
  };

  // Trigger hard delete confirmation modal
  const handleHardDeleteTrigger = (id: string, name: string) => {
    setCandidateToHardDelete(id);
    setCandidateNameToHardDelete(name);
    setHardDeleteConfirmOpen(true);
  };

  // Perform actual hard delete
  const executeHardDeleteCandidate = async () => {
    if (!candidateToHardDelete) return;
    try {
      const res = await http.delete(`/admin/hr/candidates/${candidateToHardDelete}/hard`);
      if (res.data && res.data.success) {
        toast.success('Candidate permanently deleted');
        fetchTrashCandidates();
        fetchCandidates();
      }
    } catch (err) {
      toast.error('Failed to permanently delete candidate');
    } finally {
      setHardDeleteConfirmOpen(false);
      setCandidateToHardDelete(null);
    }
  };

  // Open Composer Modal
  const handleOpenComposer = (candidate: Candidate, e: React.MouseEvent) => {
    e.stopPropagation();
    setCandidateForEmail(candidate);
    setComposerOpen(true);
  };

  // Triggered when email sends successfully in composer
  const handleComposerSuccess = (updatedCandidate: Candidate) => {
    fetchCandidates();
    const vId = viewingCandidate?.id || (viewingCandidate as any)?._id;
    const uId = updatedCandidate.id || (updatedCandidate as any)._id;
    if (vId === uId) {
      setViewingCandidate(updatedCandidate);
      fetchEmailLogs(uId);
    }
  };

  // Resend email log from history
  const handleResendHistoryLog = async (logId: string) => {
    try {
      setResendingLogId(logId);
      const res = await http.post(`/admin/hr/email-logs/resend/${logId}`);
      if (res.data && res.data.success) {
        toast.success('Email resent successfully!');
        if (viewingCandidate) {
          fetchEmailLogs(viewingCandidate.id);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to resend email';
      toast.error(msg);
    } finally {
      setResendingLogId(null);
    }
  };

  // Open Candidate Detail view
  const handleSelectCandidate = (candidate: Candidate) => {
    setViewingCandidate(candidate);
    fetchEmailLogs(candidate.id);
  };

  // Date format helper
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Filter candidates list
  const filteredCandidates = useMemo(() => {
    const query = search.toLowerCase();
    return candidates.filter((cand) => {
      const matchesSearch =
        cand.fullName.toLowerCase().includes(query) ||
        cand.email.toLowerCase().includes(query) ||
        (cand.designation && cand.designation.toLowerCase().includes(query));
      
      const matchesFilter = statusFilter === '' || cand.status === statusFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [candidates, search, statusFilter]);

  // Tone colors for Candidate Status badge
  const getStatusTone = (status: string): 'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'Offer Sent':
        return 'warning';
      case 'Accepted':
        return 'success';
      case 'Joined':
        return 'success';
      case 'Rejected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {viewingCandidate ? (
        // Candidate Details Page
        <div className="space-y-6">
          <header className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setViewingCandidate(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-heading hover:bg-mist-100 px-3 py-1.5 rounded-md transition-colors"
            >
              <ArrowLeft size={14} /> Back to Directory
            </button>
            <div className="h-4 w-px bg-neutral-200" />
            <h1 className="text-xl font-bold text-heading truncate max-w-sm">
              {viewingCandidate.fullName}
            </h1>
            <Badge tone={getStatusTone(viewingCandidate.status)}>{viewingCandidate.status}</Badge>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left/Middle Profile details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile card details */}
              <Card hover={false} className="p-6 space-y-4">
                <h3 className="text-sm font-semibold text-heading uppercase tracking-wider border-b border-neutral-100 pb-2">
                  Candidate Profile Info
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Full Name</span>
                    <span className="text-sm font-semibold text-heading">{viewingCandidate.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Email Address</span>
                    <span className="text-sm font-semibold text-primary-600">{viewingCandidate.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Phone Number</span>
                    <span className="text-sm text-neutral-600">{viewingCandidate.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Designation</span>
                    <span className="text-sm text-neutral-600 font-semibold">{viewingCandidate.designation || 'N/A'}</span>
                  </div>
                  <div className="col-span-full">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Notes / Remarks</span>
                    <p className="text-xs text-neutral-500 bg-mist-50/50 rounded p-3 border border-neutral-100 leading-relaxed whitespace-pre-wrap mt-1">
                      {viewingCandidate.notes || 'No candidate notes recorded.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end border-t border-neutral-100 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleOpenEdit(viewingCandidate, e)}
                  >
                    <Edit size={14} /> Edit Candidate Profile
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => handleOpenComposer(viewingCandidate, e)}
                  >
                    <Mail size={14} /> Compose &amp; Send Offer Email
                  </Button>
                </div>
              </Card>

              {/* Email History card */}
              <Card hover={false} className="p-6">
                <h3 className="text-sm font-semibold text-heading uppercase tracking-wider border-b border-neutral-100 pb-3 mb-4">
                  Email History logs
                </h3>

                {loadingLogs ? (
                  <div className="flex h-32 items-center justify-center">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600/30 border-t-primary-600" />
                  </div>
                ) : emailLogs.length === 0 ? (
                  <div className="text-center p-8 text-neutral-400 text-xs">
                    <Mail size={28} className="mx-auto mb-2 opacity-50" />
                    No emails have been sent to this candidate yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-500">
                      <thead className="bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100">
                        <tr>
                          <th className="px-4 py-3">Subject</th>
                          <th className="px-4 py-3">Recipient</th>
                          <th className="px-4 py-3">CC</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Sent On</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {emailLogs.map((log) => {
                          const dt = formatDateTime(log.createdAt);
                          return (
                            <tr key={log.id} className="hover:bg-mist-50/50">
                              <td className="px-4 py-3 font-semibold text-heading truncate max-w-[150px]">{log.subject}</td>
                              <td className="px-4 py-3">{log.recipient}</td>
                              <td className="px-4 py-3 truncate max-w-[100px]">{log.cc || '—'}</td>
                              <td className="px-4 py-3">
                                {log.deliveryStatus === 'success' ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                    <CheckCircle size={10} /> Sent
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                                    <XCircle size={10} /> Failed
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-neutral-400">
                                {dt.date} at {dt.time}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedLog(log);
                                      setLogDetailOpen(true);
                                    }}
                                    className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-heading"
                                    title="View Email"
                                  >
                                    <Eye size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleResendHistoryLog(log.id)}
                                    disabled={resendingLogId === log.id}
                                    className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-heading disabled:opacity-50"
                                    title="Resend Email"
                                  >
                                    <RefreshCw
                                      size={13}
                                      className={resendingLogId === log.id ? 'animate-spin' : ''}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Panel: Offer Letter PDF Manager Card */}
            <div>
              <Card hover={false} className="p-6 space-y-4">
                <h3 className="text-sm font-semibold text-heading uppercase tracking-wider border-b border-neutral-100 pb-2">
                  Offer Letter PDF
                </h3>

                {viewingCandidate.offerLetter && viewingCandidate.offerLetter.path ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-neutral-200 p-4 bg-mist-50/50 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <FileText className="text-primary-500 mt-0.5 shrink-0" size={20} />
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-heading truncate">
                            {viewingCandidate.offerLetter.originalName}
                          </span>
                          <span className="block text-[10px] text-neutral-400 mt-0.5">
                            Size: {(viewingCandidate.offerLetter.size ? viewingCandidate.offerLetter.size / 1024 : 0).toFixed(1)} KB
                          </span>
                          <span className="block text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                            <Clock size={9} /> Uploaded on {formatDate(viewingCandidate.offerLetter.uploadedAt || '')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`${import.meta.env.VITE_API_URL}/admin/hr/candidates/${viewingCandidate.id || (viewingCandidate as any)._id}/offer-letter/preview`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Eye size={12} /> Preview
                      </a>
                      <a
                        href={`${import.meta.env.VITE_API_URL}/admin/hr/candidates/${viewingCandidate.id || (viewingCandidate as any)._id}/offer-letter/download`}
                        download
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Download size={12} /> Download
                      </a>
                    </div>

                    <div className="border-t border-neutral-100 pt-3 flex gap-2">
                      {/* Replace input trigger */}
                      <label className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-neutral-900 text-white px-3 py-2 text-xs font-semibold hover:bg-neutral-800 cursor-pointer transition-colors">
                        <Upload size={12} /> Replace PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleUploadOfferLetter(viewingCandidate.id || (viewingCandidate as any)._id, e)}
                          disabled={uploadingPdfId === (viewingCandidate.id || (viewingCandidate as any)._id)}
                          className="sr-only"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleDeleteOfferLetterTrigger(viewingCandidate.id || (viewingCandidate as any)._id)}
                        className="rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 p-2 transition-colors"
                        title="Delete PDF File"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center bg-mist-50/20 space-y-4">
                    <FileText className="text-neutral-300 mx-auto" size={36} />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-heading">No Offer Letter Uploaded</p>
                      <p className="text-[10px] text-neutral-400">Prepare offer letter manually in Word/external editor and upload as PDF.</p>
                    </div>
                    <div>
                      <label className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary-600 text-white px-4 py-2 text-xs font-semibold hover:bg-primary-700 cursor-pointer transition-colors">
                        <Plus size={12} /> Upload PDF
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleUploadOfferLetter(viewingCandidate.id, e)}
                          disabled={uploadingPdfId === viewingCandidate.id}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                )}
                {uploadingPdfId === viewingCandidate.id && (
                  <div className="text-center text-[10px] text-neutral-400 flex items-center gap-1.5 justify-center mt-1">
                    <span className="h-3 w-3 animate-spin rounded-full border border-neutral-400/30 border-t-neutral-400" />
                    Uploading offer letter...
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      ) : (
        // Candidates Table Directory View
        <div className="space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-heading">Candidates</h1>
              <Badge tone="neutral">{filteredCandidates.length}</Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchTrashCandidates();
                  setTrashOpen(true);
                }}
              >
                <Trash2 size={15} /> Trash / Restore
              </Button>
              <Button size="sm" onClick={handleOpenCreate}>
                <Plus size={15} /> Add Candidate
              </Button>
            </div>
          </header>

          {/* Search and filter controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="relative max-w-sm flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search candidates by name, email, role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-btn border border-neutral-200 bg-white pl-10 pr-4 py-3 text-sm text-heading placeholder:text-neutral-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-btn border border-neutral-200 bg-white px-3 py-3 text-sm text-heading outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Offer Sent">Offer Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Joined">Joined</option>
              </select>
            </div>
          </div>

          {/* Candidates Grid/List */}
          <Card hover={false} className="overflow-hidden p-0">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600/30 border-t-primary-600" />
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Users size={40} className="text-neutral-300 mb-3" />
                <p className="text-sm font-semibold text-heading">No candidates found</p>
                <p className="text-xs text-neutral-400 mt-1">Add a new candidate record to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-neutral-500">
                  <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100">
                    <tr>
                      <th className="px-6 py-4">Full Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Designation</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Offer Letter PDF</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {filteredCandidates.map((cand) => {
                      const cId = cand.id || (cand as any)._id;
                      return (
                        <tr
                          key={cId}
                          onClick={() => handleSelectCandidate(cand)}
                          className="hover:bg-mist-50/50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 font-semibold text-heading">{cand.fullName}</td>
                          <td className="px-6 py-4">{cand.email}</td>
                          <td className="px-6 py-4 font-medium">{cand.designation || '—'}</td>
                          <td className="px-6 py-4">
                            <Badge tone={getStatusTone(cand.status)}>{cand.status}</Badge>
                          </td>
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            {cand.offerLetter && cand.offerLetter.path ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-neutral-600 truncate max-w-[150px]" title={cand.offerLetter.originalName || 'Offer-Letter.pdf'}>
                                  {cand.offerLetter.originalName || 'Offer-Letter.pdf'}
                                </span>
                                <a
                                  href={`${import.meta.env.VITE_API_URL}/admin/hr/candidates/${cId}/offer-letter/download`}
                                  download
                                  className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-heading"
                                  title="Download PDF"
                                >
                                  <Download size={13} />
                                </a>
                                <button
                                  onClick={() => handleDeleteOfferLetterTrigger(cId)}
                                  className="p-1 rounded hover:bg-neutral-100 text-red-500"
                                  title="Delete PDF"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ) : (
                              <label className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 cursor-pointer font-semibold bg-primary-50 px-2.5 py-1 rounded hover:bg-primary-100 transition-colors border border-primary-200">
                                <Plus size={11} /> Upload PDF
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) => handleUploadOfferLetter(cId, e)}
                                  disabled={uploadingPdfId === cId}
                                  className="sr-only"
                                />
                              </label>
                            )}
                            {uploadingPdfId === cId && (
                              <span className="text-[10px] text-neutral-400 ml-2 animate-pulse">Uploading...</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={(e) => handleOpenComposer(cand, e)}
                                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-heading"
                                title="Compose &amp; Send Offer Letter"
                              >
                                <Mail size={15} />
                              </button>
                              <button
                                onClick={(e) => handleOpenEdit(cand, e)}
                                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-heading"
                                title="Edit Candidate Details"
                              >
                                <Edit size={15} />
                              </button>
                              <button
                                  onClick={(e) => handleDeleteCandidateTrigger(cId, cand.fullName, e)}
                                  className="p-1.5 rounded hover:bg-neutral-100 text-red-500 hover:bg-red-50"
                                  title="Soft Delete"
                                >
                                <Trash size={15} />
                              </button>
                          </div>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Add / Edit Candidate Form Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingCandidate ? 'Edit Candidate Details' : 'Add New Candidate'}
        size="md"
      >
        <form onSubmit={handleSaveCandidate} className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={savingCandidate}
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@email.com"
            required
            disabled={savingCandidate}
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            disabled={savingCandidate}
          />
          <Input
            label="Designation / Role"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Software Developer"
            disabled={savingCandidate}
          />
          <Select
            label="Candidate Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'Draft', label: 'Draft' },
              { value: 'Offer Sent', label: 'Offer Sent' },
              { value: 'Accepted', label: 'Accepted' },
              { value: 'Rejected', label: 'Rejected' },
              { value: 'Joined', label: 'Joined' },
            ]}
            disabled={savingCandidate}
          />
          <Textarea
            label="Internal Remarks / Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any interview evaluation details, references, or offer specifics here..."
            disabled={savingCandidate}
            rows={4}
          />

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 mt-6">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setFormOpen(false)}
              disabled={savingCandidate}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={savingCandidate}>
              {editingCandidate ? 'Update Profile' : 'Add Candidate'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Trash Bin / Soft Deleted Candidates Modal */}
      <Modal
        open={trashOpen}
        onClose={() => setTrashOpen(false)}
        title="Trash Bin — Restore Candidates"
        size="lg"
      >
        {loadingTrash ? (
          <div className="flex h-32 items-center justify-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600/30 border-t-primary-600" />
          </div>
        ) : deletedCandidates.length === 0 ? (
          <div className="text-center p-8 text-neutral-400 text-xs">
            <Trash size={28} className="mx-auto mb-2 opacity-50" />
            Trash bin is empty. No candidates have been deleted.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-neutral-100 rounded-md">
              <table className="w-full text-left text-xs text-neutral-500">
                <thead className="bg-neutral-50 text-[10px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Deleted On</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {deletedCandidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-mist-50/50">
                      <td className="px-4 py-3 font-semibold text-heading">{cand.fullName}</td>
                      <td className="px-4 py-3">{cand.email}</td>
                      <td className="px-4 py-3">{cand.designation || '—'}</td>
                      <td className="px-4 py-3 text-neutral-400">{formatDate(cand.deletedAt || '')}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestoreCandidate(cand.id || (cand as any)._id)}
                            className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded inline-flex items-center"
                          >
                            <RotateCcw size={12} className="mr-1" /> Restore
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleHardDeleteTrigger(cand.id || (cand as any)._id, cand.fullName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded inline-flex items-center"
                          >
                            <Trash size={12} className="mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setTrashOpen(false)}>
                Close Bin
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Log Details Modal (for history list) */}
      <Modal
        open={logDetailOpen}
        onClose={() => setLogDetailOpen(false)}
        title="Sent Email Details"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 border border-neutral-100 rounded-md bg-mist-50 p-4 sm:grid-cols-2">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">From</span>
                <span className="text-sm font-semibold text-heading">{selectedLog.sentBy}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">To</span>
                <span className="text-sm font-semibold text-heading">{selectedLog.recipient}</span>
              </div>
              {selectedLog.cc && (
                <div className="col-span-full">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Cc</span>
                  <span className="text-sm text-neutral-600">{selectedLog.cc}</span>
                </div>
              )}
              <div className="col-span-full">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Subject</span>
                <span className="text-sm font-semibold text-heading">{selectedLog.subject}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Delivery Status</span>
                {selectedLog.deliveryStatus === 'success' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 mt-1">
                    <CheckCircle size={12} /> Success
                  </span>
                ) : (
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                      <XCircle size={12} /> Failed
                    </span>
                    <span className="block text-xs text-red-600 mt-1">{selectedLog.errorMessage}</span>
                  </div>
                )}
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Timestamp</span>
                <span className="text-sm text-neutral-600 mt-1 block">
                  {formatDateTime(selectedLog.createdAt).date} at {formatDateTime(selectedLog.createdAt).time}
                </span>
              </div>
            </div>

            {/* Email Attachments list */}
            {selectedLog.attachments && selectedLog.attachments.length > 0 && (
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Attachments</span>
                <div className="flex flex-wrap gap-2">
                  {selectedLog.attachments.map((att, i) => (
                    <div key={i} className="inline-flex items-center gap-1.5 rounded bg-neutral-100 px-2.5 py-1 text-xs text-neutral-700">
                      <Paperclip size={12} />
                      <span>{att.originalName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Message Body</span>
              <div
                className="border border-neutral-200 rounded-btn p-5 bg-white max-h-[300px] overflow-y-auto prose prose-sm max-w-none text-heading"
                dangerouslySetInnerHTML={{ __html: selectedLog.body }}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 mt-6">
              <Button variant="ghost" onClick={() => setLogDetailOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setLogDetailOpen(false);
                  handleResendHistoryLog(selectedLog.id);
                }}
              >
                Resend Email
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Rich Text Email Composer Modal */}
      {candidateForEmail && (
        <EmailComposerModal
          open={composerOpen}
          onClose={() => {
            setComposerOpen(false);
            setCandidateForEmail(null);
          }}
          candidate={candidateForEmail}
          onSuccess={handleComposerSuccess}
        />
      )}
      {/* Delete Candidate Confirmation Modal */}
      {deleteConfirmOpen && candidateToDelete && (
        <Modal
          open={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setCandidateToDelete(null);
          }}
          title="Confirm Soft Delete"
          size="md"
        >
          <div className="space-y-4 py-2">
            <p className="text-sm text-neutral-600">
              Are you sure you want to move candidate <strong className="text-heading">{candidateNameToDelete}</strong> to the Trash Bin? You can restore them later.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setCandidateToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={executeDeleteCandidate}
              >
                Move to Trash
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete PDF Confirmation Modal */}
      {pdfDeleteConfirmOpen && candidateForPdfDelete && (
        <Modal
          open={pdfDeleteConfirmOpen}
          onClose={() => {
            setPdfDeleteConfirmOpen(false);
            setCandidateForPdfDelete(null);
          }}
          title="Confirm PDF Deletion"
          size="md"
        >
          <div className="space-y-4 py-2">
            <p className="text-sm text-neutral-600">
              Are you sure you want to delete this offer letter PDF? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setPdfDeleteConfirmOpen(false);
                  setCandidateForPdfDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={executeDeleteOfferLetter}
              >
                Delete PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {/* Delete Candidate Permanently Confirmation Modal */}
      {hardDeleteConfirmOpen && candidateToHardDelete && (
        <Modal
          open={hardDeleteConfirmOpen}
          onClose={() => {
            setHardDeleteConfirmOpen(false);
            setCandidateToHardDelete(null);
          }}
          title="Confirm Permanent Deletion"
          size="md"
        >
          <div className="space-y-4 py-2">
            <p className="text-sm text-neutral-600">
              Are you sure you want to permanently delete candidate <strong className="text-heading">{candidateNameToHardDelete}</strong>? This will remove all their details, files, and email logs. <strong className="text-red-600 font-semibold">This action cannot be undone.</strong>
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setHardDeleteConfirmOpen(false);
                  setCandidateToHardDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={executeHardDeleteCandidate}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
