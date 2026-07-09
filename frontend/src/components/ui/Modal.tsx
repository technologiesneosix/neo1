import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

const sizes = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, children, size = 'lg' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const prevOpenRef = useRef(open);

  const titleId = useId();
  const renderedTitle = title ?? 'Dialog';

  useEffect(() => {
    // Store last focused element so we can restore focus after close.
    if (open) lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    // Restore focus when the modal closes.
    if (prevOpenRef.current && !open) {
      lastFocusedRef.current?.focus?.();
    }
    prevOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Move focus into the dialog for keyboard + screen reader users.
    const id = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  const trapFocus = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn('my-auto w-full rounded-lg bg-white shadow-2xl', sizes[size])}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={trapFocus}
            tabIndex={-1}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h3 id={titleId} className="text-lg font-bold text-heading">
                {renderedTitle}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                ref={closeButtonRef}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-mist-100 hover:text-heading"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
