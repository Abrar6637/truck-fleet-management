import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-[var(--background)]">
      {/* Left Branding Section */}
      <section className="hidden w-1/2 flex-col justify-between bg-[var(--primary)] p-12 text-white lg:flex">
        <div>
          <div className="mb-16 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold">
              F
            </div>

            <div>
              <h2 className="text-xl font-bold">Fleet Management</h2>
              <p className="text-sm text-blue-100">Transport Operations</p>
            </div>
          </div>

          <div className="max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">
              Smart Fleet Operations
            </p>

            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Manage your fleet from one powerful dashboard.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
              Track trucks, manage drivers, monitor trips, control expenses,
              schedule maintenance, and keep your fleet moving efficiently.
            </p>
          </div>
        </div>

        <p className="text-sm text-blue-200">Fleet Management System</p>
      </section>

      {/* Login Section */}
      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden">
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-xl font-bold text-white">
              F
            </div>

            <h2 className="text-lg font-bold text-[var(--text)]">
              Fleet Management
            </h2>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Sign in to access your fleet management account.
            </p>
          </div>

          <form className="space-y-5">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
              />

              <label
                htmlFor="remember"
                className="text-sm text-[var(--text-muted)]"
              >
                Remember me
              </label>
            </div>

            <Button type="submit" fullWidth>
              Sign in
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
            Secure access for fleet administrators and drivers.
          </p>
        </div>
      </section>
    </main>
  );
}