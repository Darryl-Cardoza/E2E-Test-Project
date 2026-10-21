"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, saveSession } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to sign in.");
      saveSession(data.token, data.user); router.push("/dashboard");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not connect to the server."); }
    finally { setLoading(false); }
  }
  return <main className="auth-layout"><section className="brand-panel"><Link href="/login" className="brand"><span className="brand-mark">N</span> northstar</Link><div className="brand-copy"><span className="eyebrow">YOUR WORKSPACE, REIMAGINED</span><h1>Make room for<br />your best work.</h1><p>A calmer place to focus, organize, and move forward.</p></div><div className="brand-bottom"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="orbit orbit-three"/><span>Thoughtfully simple. Made for you.</span></div></section><section className="form-panel"><div className="auth-card"><div className="mobile-brand"><span className="brand-mark">N</span> northstar</div><div className="form-heading"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p>Your next great workday starts here.</p></div><form onSubmit={submit}><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /><label htmlFor="password">Password</label><input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} />{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<span aria-hidden="true">→</span></button></form><p className="switch-auth">New to Northstar? <Link href="/register">Create an account</Link></p><p className="terms">By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p></div></section></main>;
}
