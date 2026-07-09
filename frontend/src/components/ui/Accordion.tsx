import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';

export interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn('divide-y divide-neutral-100 rounded-md bg-white shadow-card', className)}>
      {items.map((item, idx) => {
        const open = openId === item.id;
        return (
          <div key={item.id ?? idx}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className={cn('text-[15px] font-semibold', open ? 'text-primary-600' : 'text-heading')}>
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className={cn('shrink-0', open ? 'text-primary-600' : 'text-neutral-400')}
              >
                <Plus size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-sm leading-7 text-body">{item.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
