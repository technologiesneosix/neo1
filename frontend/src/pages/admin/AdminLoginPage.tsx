import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormControls';
import { useAuth } from '@/features/auth/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

/** Standalone admin sign-in screen on a dark canvas with gradient blobs. */
export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values.email, values.password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? '/admin', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign in failed');
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden="true"
        className="absolute -left-32 -top-32 h-96 w-96 animate-blob-drift rounded-full bg-primary-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] animate-blob-drift rounded-full bg-azure-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl"
      />

      <section
        aria-label="Admin sign in"
        className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-2xl sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <span className="rounded-md bg-ink-900 px-5 py-3">
            <Logo dark />
          </span>
          <div>
            <h1 className="text-xl font-bold text-heading">Admin Panel</h1>
            <p className="mt-1 text-sm text-neutral-500">Sign in to manage your site content.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            type="email"
            label="Email"
            required
            autoComplete="email"
            placeholder="technologiesneosix@gmail.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            type="password"
            label="Password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" loading={isSubmitting} className="w-full">
            <LogIn size={15} aria-hidden="true" />
            Sign In
          </Button>
        </form>

        <aside
          aria-label="Demo credentials"
          className="mt-6 flex items-start gap-3 rounded-md border border-primary-100 bg-primary-50 px-4 py-3"
        >
          <KeyRound size={16} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-primary-800">
            <strong className="font-semibold">Demo credentials</strong>
            <br />
            Email: <code className="font-mono">technologiesneosix@gmail.com</code>
            <br />
            Password: <code className="font-mono">neosix123</code>
          </p>
        </aside>
      </section>
    </main>
  );
}
