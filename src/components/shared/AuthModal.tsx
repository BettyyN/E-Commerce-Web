import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/shared/ui/dialog";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { isAxiosError } from "axios";
import { useLogin, useRegister } from "@/service/auth/auth.queries";
import { useAuthStore } from "@/store/auth.store";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (isAxiosError<{ detail?: string; title?: string }>(error)) {
    return (
      error.response?.data?.detail ??
      error.response?.data?.title ??
      (error.code === "ERR_NETWORK"
        ? "Cannot reach the server"
        : error.message)
    );
  }

  return error instanceof Error ? error.message : fallback;
}


// ─── Password input ───────────────────────────────────────────────────────────

function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-xl border-slate-200 bg-slate-50 pr-10 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-white"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ─── Shared field wrapper ─────────────────────────────────────────────────────

function Field({
  label,
  children,
  action,
  required,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Submit button ────────────────────────────────────────────────────────────

function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: string;
}) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="h-11 w-full rounded-xl bg-yellow-500 text-sm font-semibold text-white hover:bg-yellow-600 active:bg-yellow-700 disabled:opacity-60 transition-colors shadow-sm"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {children}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-xs text-slate-400">{label}</span>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

// ─── Dialog shell ─────────────────────────────────────────────────────────────

const dialogClassName =
  "w-full max-w-md gap-0 rounded-2xl border-0 p-0 shadow-2xl shadow-black/10 ring-1 ring-black/6 " +
  "[&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:z-20 " +
  "[&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-slate-100 [&_[data-slot=dialog-close]]:p-1.5 " +
  "[&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:opacity-100 hover:[&_[data-slot=dialog-close]]:bg-slate-200";

const signupDialogClassName =
  "w-full max-w-md md:max-w-xl gap-0 rounded-2xl border-0 p-0 shadow-2xl shadow-black/10 ring-1 ring-black/6 " +
  "[&_[data-slot=dialog-close]]:top-4 [&_[data-slot=dialog-close]]:right-4 [&_[data-slot=dialog-close]]:z-20 " +
  "[&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-slate-100 [&_[data-slot=dialog-close]]:p-1.5 " +
  "[&_[data-slot=dialog-close]]:text-slate-500 [&_[data-slot=dialog-close]]:opacity-100 hover:[&_[data-slot=dialog-close]]:bg-slate-200";

// ─── Login Modal ──────────────────────────────────────────────────────────────

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
}

export function LoginModal({
  open,
  onOpenChange,
  onSwitchToSignup,
}: LoginModalProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const loading = loginMutation.isPending;

  const reset = () => {
    setIdentifier("");
    setPassword("");
    loginMutation.reset();
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
     await loginMutation.mutateAsync({
        username: identifier.trim(),
        password,
      });

      toast.success("Welcome back!");
      handleClose(false);

      // useLogin's onSuccess stored the decoded user, so it's available here
      const user = useAuthStore.getState().user;
      if (user && user.role !== "customer") navigate("/dashboard");
    } catch (error) {
   toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={dialogClassName}>
        <DialogTitle className="sr-only">Sign in</DialogTitle>
        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <img
              src="/verticalLogo.png"
              alt="STOCK UP"
              className="mx-auto mb-3 h-24 w-auto"
            />
            <h2 className=" text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Phone" required>
              <Input
                type="text"
                autoComplete="username"
                placeholder="+251 911 234 567"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-9 rounded-xl border-slate-200 bg-slate-50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-white"
              />
            </Field>

            <Field
              label="Password"
              required
              action={
                <button
                  type="button"
                  className="text-xs font-medium text-yellow-600 hover:text-yellow-700 hover:underline underline-offset-4"
                >
                  Forgot password?
                </button>
              }
            >
              <PasswordInput value={password} onChange={setPassword} />
            </Field>

            <SubmitButton loading={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </SubmitButton>


            <Divider label="New here?" />

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  handleClose(false);
                  onSwitchToSignup();
                }}
                className="font-semibold text-yellow-600 hover:text-yellow-700 underline-offset-4 hover:underline"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Signup Modal ─────────────────────────────────────────────────────────────

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({
  open,
  onOpenChange,
  onSwitchToLogin,
}: SignupModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tin, setTin] = useState("");
  const registerMutation = useRegister();
  const loading = registerMutation.isPending;

  const reset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setTin("");
    registerMutation.reset();
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await registerMutation.mutateAsync({
        fullName: name,
        email,
        phoneNum: phone,
        password,
        tin, // TODO: add a TIN input, or make it optional in CustReg
      });

      toast.success("Account created! Pending approval.");
      handleClose(false);
      onSwitchToLogin();
    } catch (error) {
     toast.error(
       error instanceof Error ? error.message : "Registration failed",
     );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={signupDialogClassName}>
        <DialogTitle className="sr-only">Create account</DialogTitle>
        <div className="px-8 py-4">
          {/* Header */}
          <div className="mb-4 text-center">
            <img
              src="/verticalLogo.png"
              alt="STOCK UP"
              className="mx-auto mb-3 h-20 w-auto"
            />
            <h2 className=" text-2xl font-bold tracking-tight text-slate-900">
              Create account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Join thousands of shoppers on STOCK UP
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Two-column grid on md+ */}
           <div className="grid gap-4 md:grid-cols-2">
  <Field label="Full name" required>
    <Input
      placeholder="Abebe Kebede"
      required
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="h-9 rounded-xl border-slate-200 bg-slate-50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-white"
    />
  </Field>

  <Field label="Phone number" required>
    <Input
      type="tel"
      placeholder="+251 911 234 567"
      required
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="h-9 rounded-xl border-slate-200 bg-slate-50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-white"
    />
  </Field>

  <Field label="Tin Number">
    <Input
      placeholder="5246789"
      value={tin}
      onChange={(e) => setTin(e.target.value)}
      className="h-9 rounded-xl border-slate-200 bg-slate-50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-white"
    />
  </Field>

  <Field label="Email">
    <Input
      type="email"
      placeholder="you@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="h-9 rounded-xl border-slate-200 bg-slate-50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:bg-white"
    />
  </Field>

  <Field label="Password" required>
    <PasswordInput
      value={password}
      onChange={setPassword}
      placeholder="Min 6 characters"
    />
  </Field>
</div>
            <SubmitButton loading={loading}>
              {loading ? "Creating account..." : "Create account"}
            </SubmitButton>
            <p className="text-center text-xs text-slate-400 leading-relaxed">
              By signing up you agree to our{" "}
              <Link
                to="/terms-of-service"
                className="text-yellow-600 hover:underline underline-offset-4"
              >
                Terms
              </Link>
              {" & "}
              <Link
                to="/privacy-policy"
                className="text-yellow-600 hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
            </p>
            <Divider label="Already a member?" />
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  handleClose(false);
                  onSwitchToLogin();
                }}
                className="font-semibold text-yellow-600 hover:text-yellow-700 underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
