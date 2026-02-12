import { login } from "@/app/login/actions";
import Image from "next/image";

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form className="bg-card border border-card-border p-8 rounded-[2.5rem] w-full max-w-md space-y-8 shadow-xl relative overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo-new.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Access
          </h1>
          <p className="text-muted text-sm">Sign in to manage the store</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted ml-2 mb-2 block">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="example@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-8 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-light text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted ml-2 mb-2 block">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-8 text-white placeholder-white/20 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-light text-lg"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            formAction={login}
            className="w-full bg-white hover:bg-white/90 text-black font-bold py-4 rounded-full transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
