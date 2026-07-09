import {
  Bold,
  Eraser,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { FieldWrapper } from '@/components/ui/FormControls';

/**
 * Tailwind styles applied to the editable area so authored HTML (h2/h3, lists,
 * blockquotes, links) previews the way the public site renders it.
 */
export const richTextContentClass = cn(
  'min-h-[180px] px-4 py-3 text-sm leading-relaxed text-heading outline-none',
  '[&_p]:mb-3',
  '[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-heading',
  '[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-heading',
  '[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6',
  '[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_blockquote]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-primary-400 [&_blockquote]:bg-mist-50 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-500',
  '[&_a]:text-primary-600 [&_a]:underline',
);

interface ToolbarAction {
  icon: LucideIcon;
  title: string;
  run: () => void;
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

/**
 * Lightweight dependency-free rich text editor built on contentEditable and
 * document.execCommand. Controlled through an HTML string value.
 */
export function RichTextEditor({
  value,
  onChange,
  label,
  error,
  required,
  placeholder = 'Write content…',
}: RichTextEditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync external value into the editable area without stomping the caret
  // while the user is typing (only write when the HTML actually differs).
  useEffect(() => {
    const node = contentRef.current;
    if (node && node.innerHTML !== value) {
      node.innerHTML = value || '';
    }
  }, [value]);

  const emit = () => onChange(contentRef.current?.innerHTML ?? '');

  const exec = (command: string, arg?: string) => {
    contentRef.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const actions: ToolbarAction[] = [
    { icon: Bold, title: 'Bold', run: () => exec('bold') },
    { icon: Italic, title: 'Italic', run: () => exec('italic') },
    { icon: Heading2, title: 'Heading 2', run: () => exec('formatBlock', '<h2>') },
    { icon: Heading3, title: 'Heading 3', run: () => exec('formatBlock', '<h3>') },
    { icon: List, title: 'Bullet list', run: () => exec('insertUnorderedList') },
    { icon: ListOrdered, title: 'Ordered list', run: () => exec('insertOrderedList') },
    { icon: Quote, title: 'Blockquote', run: () => exec('formatBlock', '<blockquote>') },
    {
      icon: Link2,
      title: 'Insert link',
      run: () => {
        const url = window.prompt('Link URL', 'https://');
        if (url) exec('createLink', url);
      },
    },
    {
      icon: Eraser,
      title: 'Clear formatting',
      run: () => {
        exec('removeFormat');
        exec('formatBlock', '<p>');
      },
    },
  ];

  return (
    <FieldWrapper label={label} error={error} required={required}>
      <div
        className={cn(
          'overflow-hidden rounded-btn border bg-white transition-colors focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
          error ? 'border-red-400' : 'border-neutral-200',
        )}
      >
        <div
          className="flex flex-wrap items-center gap-0.5 border-b border-neutral-100 bg-mist-50 px-2 py-1.5"
          role="toolbar"
          aria-label="Text formatting"
        >
          {actions.map((action) => (
            <button
              key={action.title}
              type="button"
              title={action.title}
              aria-label={action.title}
              onMouseDown={(event) => event.preventDefault()}
              onClick={action.run}
              className="rounded p-1.5 text-neutral-500 transition-colors hover:bg-white hover:text-primary-600"
            >
              <action.icon size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div
          ref={contentRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label={label ?? 'Rich text content'}
          data-placeholder={placeholder}
          onInput={emit}
          onBlur={emit}
          className={richTextContentClass}
          suppressContentEditableWarning
        />
      </div>
    </FieldWrapper>
  );
}
