import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

const fieldClasses =
  'w-full rounded-btn border border-neutral-200 bg-white px-4 py-3 text-sm text-heading placeholder:text-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-mist-100';

interface FieldWrapperProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({ label, error, required, children, className }: FieldWrapperProps) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
      )}
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, required, ...rest },
  ref,
) {
  return (
    <FieldWrapper label={label} error={error} required={required} className={className}>
      <input ref={ref} className={cn(fieldClasses, error && 'border-red-400')} {...rest} />
    </FieldWrapper>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, required, rows = 5, ...rest },
  ref,
) {
  return (
    <FieldWrapper label={label} error={error} required={required} className={className}>
      <textarea
        ref={ref}
        rows={rows}
        className={cn(fieldClasses, 'resize-y', error && 'border-red-400')}
        {...rest}
      />
    </FieldWrapper>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className, required, ...rest },
  ref,
) {
  return (
    <FieldWrapper label={label} error={error} required={required} className={className}>
      <select ref={ref} className={cn(fieldClasses, error && 'border-red-400')} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
});

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, className, ...rest },
  ref,
) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-3', className)}>
      <span className="relative inline-block h-6 w-11">
        <input ref={ref} type="checkbox" className="peer sr-only" {...rest} />
        <span className="absolute inset-0 rounded-full bg-neutral-300 transition-colors peer-checked:bg-primary-600" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      {label && <span className="text-sm font-medium text-heading">{label}</span>}
    </label>
  );
});
