import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  Mail,
  Search,
  Eye,
  RefreshCw,
  AlertTriangle,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Paperclip,
  Trash,
} from 'lucide-react';
import { http } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { EmailLog } from '@/types';

export function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Resend loading states
  const [resendingLogId, setResendingLogId] = useState<string | null>(null);

  // Detail Modal states
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Delete Email Log states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<EmailLog | null>(null);

  const handleDeleteLog = async () => {
    if (!logToDelete) return;
    try {
      const logId = logToDelete.id || (logToDelete as any)._id;
      const res = await http.delete(`/admin/hr/email-logs/${logId}`);
      if (res.data && res.data.success) {
        toast.success('Email log deleted successfully');
        fetchLogs();
      }
    } catch (err) {
      toast.error('Failed to delete email log');
    } finally {
      setDeleteConfirmOpen(false);
      setLogToDelete(null);
    }
  };

  // Fetch logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await http.get('/admin/hr/email-logs');
      if (res.data && res.data.success) {
        setLogs(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load email logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs by search query
  const filteredLogs = useMemo(() => {
    if (!search) return logs;
    const query = search.toLowerCase();
    return logs.filter((log) => {
      const candidateName = typeof log.candidate === 'object' && log.candidate ? log.candidate.fullName : '';
      return (
        log.recipient.toLowerCase().includes(query) ||
        log.subject.toLowerCase().includes(query) ||
        log.sentBy.toLowerCase().includes(query) ||
        candidateName.toLowerCase().includes(query)
      );
    });
  }, [logs, search]);

  // Resend email
  const handleResend = async (logId: string) => {
    try {
      setResendingLogId(logId);
      const res = await http.post(`/admin/hr/email-logs/resend/${logId}`);
      if (res.data && res.data.success) {
        toast.success('Email resent successfully!');
        fetchLogs(); // refresh the logs
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to resend email';
      toast.error(msg);
    } finally {
      setResendingLogId(null);
    }
  };

  // Format date/time
  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-heading">Email Logs</h1>
          <span className="inline-flex h-5 items-center justify-center rounded-full bg-mist-200 px-2.5 text-xs font-bold text-neutral-600">
            {filteredLogs.length}
          </span>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search by candidate, recipient, or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-btn border border-neutral-200 bg-white pl-10 pr-4 py-3 text-sm text-heading placeholder:text-neutral-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {/* Logs Table */}
      <Card hover={false} className="overflow-hidden p-0">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600/30 border-t-primary-600" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Mail size={40} className="text-neutral-300 mb-3" />
            <p className="text-sm font-semibold text-heading">No email logs found</p>
            <p className="text-xs text-neutral-400 mt-1">Sent offer letters will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-500">
              <thead className="bg-neutral-50 text-xs font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Recipient (To)</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Sent By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date &amp; Time</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {filteredLogs.map((log) => {
                  const candidateName =
                    typeof log.candidate === 'object' && log.candidate
                      ? log.candidate.fullName
                      : 'Unknown Candidate';
                  const candidateDesignation =
                    typeof log.candidate === 'object' && log.candidate
                      ? log.candidate.designation
                      : '';
                  
                  const dt = formatDateTime(log.createdAt);

                  return (
                    <tr key={log.id} className="hover:bg-mist-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-heading">
                        <div>
                          <span>{candidateName}</span>
                          {candidateDesignation && (
                            <span className="block text-[10px] text-neutral-400 font-normal">
                              {candidateDesignation}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{log.recipient}</td>
                      <td className="px-6 py-4 max-w-[200px] truncate" title={log.subject}>
                        {log.subject}
                      </td>
                      <td className="px-6 py-4 text-xs max-w-[150px] truncate" title={log.sentBy}>
                        {log.sentBy}
                      </td>
                      <td className="px-6 py-4">
                        {log.deliveryStatus === 'success' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                            <CheckCircle size={12} /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700" title={log.errorMessage || ''}>
                            <XCircle size={12} /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span>{dt.date}</span>
                          <span className="block text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {dt.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setDetailOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-heading"
                            title="View Email Content"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleResend(log.id || (log as any)._id)}
                            disabled={resendingLogId === (log.id || (log as any)._id)}
                            className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-heading disabled:opacity-50"
                            title="Resend this email"
                          >
                            <RefreshCw
                              size={15}
                              className={resendingLogId === (log.id || (log as any)._id) ? 'animate-spin' : ''}
                            />
                          </button>
                          <button
                            onClick={() => {
                              setLogToDelete(log);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-neutral-100 text-red-500 hover:bg-red-50"
                            title="Delete email log"
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

      {/* Log Details Modal */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Email Log Details"
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
              {selectedLog.bcc && (
                <div className="col-span-full">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Bcc</span>
                  <span className="text-sm text-neutral-600">{selectedLog.bcc}</span>
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
                    <CheckCircle size={12} /> Success (ID: {selectedLog.resendEmailId})
                  </span>
                ) : (
                  <div className="mt-1">
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

            {/* Email Attachments log list */}
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

            {/* Email Body Preview */}
            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">Message Body</span>
              <div
                className="border border-neutral-200 rounded-btn p-5 bg-white max-h-[300px] overflow-y-auto prose prose-sm max-w-none text-heading"
                dangerouslySetInnerHTML={{ __html: selectedLog.body }}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4 mt-6">
              <Button variant="ghost" onClick={() => setDetailOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setDetailOpen(false);
                  handleResend(selectedLog.id);
                }}
              >
                Resend Email
              </Button>
            </div>
          </div>
        )}
      </Modal>
      {/* Delete Email Log Confirmation Modal */}
      {deleteConfirmOpen && logToDelete && (
        <Modal
          open={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setLogToDelete(null);
          }}
          title="Confirm Delete Log"
          size="md"
        >
          <div className="space-y-4 py-2">
            <p className="text-sm text-neutral-600">
              Are you sure you want to delete this email log for <strong className="text-heading">{logToDelete.recipient}</strong> with subject <strong className="text-heading">"{logToDelete.subject}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setLogToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteLog}
              >
                Delete Log
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
