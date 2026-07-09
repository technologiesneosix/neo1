import { motion } from 'framer-motion';
import { useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
}

export function Tabs({ items, className }: TabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const active = items.find((item) => item.id === activeId) ?? items[0];

  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const sanitize = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '');

  const panelIdFor = (id: string) => `${baseId}-panel-${sanitize(id)}`;
  const tabIdFor = (id: string) => `${baseId}-tab-${sanitize(id)}`;

  const setActiveAndFocus = (nextIndex: number) => {
    const next = items[nextIndex];
    if (!next) return;
    setActiveId(next.id);
    // Focus after state update settles (keeps visual + SR in sync).
    window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  };

  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const key = event.key;
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;

    event.preventDefault();

    const lastIndex = items.length - 1;
    if (key === 'ArrowRight') return setActiveAndFocus((index + 1) % items.length);
    if (key === 'ArrowLeft') return setActiveAndFocus((index - 1 + items.length) % items.length);
    if (key === 'Home') return setActiveAndFocus(0);
    if (key === 'End') return setActiveAndFocus(lastIndex);
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-orientation="horizontal">
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const tabId = tabIdFor(item.id);
          const panelId = panelIdFor(item.id);
          return (
          <button
            key={item.id}
            role="tab"
            id={tabId}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => setActiveId(item.id)}
            onKeyDown={(e) => onTabKeyDown(e, index)}
            className={cn(
              'relative rounded-btn px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors',
              isActive ? 'text-white' : 'bg-mist-100 text-neutral-500 hover:text-heading',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-btn bg-brand-gradient"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
          );
        })}
      </div>
      <div>
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          if (!isActive) {
            return (
              <div key={item.id} role="tabpanel" id={panelIdFor(item.id)} aria-labelledby={tabIdFor(item.id)} hidden />
            );
          }
          return (
            <div
              key={item.id}
              role="tabpanel"
              id={panelIdFor(item.id)}
              aria-labelledby={tabIdFor(item.id)}
              className="mt-10"
              tabIndex={0}
            >
              {active?.id === item.id ? active.content : item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
