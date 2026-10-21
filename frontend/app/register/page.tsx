"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, saveSession } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try { const response = await fetch(`${API_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to create your account."); saveSession(data.token, data.user); router.push("/dashboard"); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not connect to the server."); } finally { setLoading(false); }
  }
  return <main className="auth-layout"><section className="brand-panel"><Link href="/login" className="brand"><span className="brand-mark">N</span> northstar</Link><div className="brand-copy"><span className="eyebrow">A FRESH START</span><h1>Good things<br />start with space.</h1><p>Bring your ideas, plans, and progress together.</p></div><div className="brand-bottom"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="orbit orbit-three"/><span>A little more clarity, every day.</span></div></section><section className="form-panel"><div className="auth-card"><div className="mobile-brand"><span className="brand-mark">N</span> northstar</div><div className="form-heading"><span className="eyebrow">GET STARTED</span><h2>Create your account</h2><p>Set up your personal workspace in a moment.</p></div><form onSubmit={submit}><label htmlFor="name">Your name</label><input id="name" type="text" placeholder="Alex Morgan" autoComplete="name" minLength={2} maxLength={60} required value={name} onChange={e => setName(e.target.value)} /><label htmlFor="email">Email address</label><input id="email" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /><label htmlFor="password">Password</label><input id="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} />{error && <div className="form-error" role="alert">{error}</div>}<button className="primary-button" disabled={loading}>{loading ? "Creating account…" : "Create account"}<span aria-hidden="true">→</span></button></form><p className="switch-auth">Already have an account? <Link href="/login">Sign in</Link></p><p className="terms">By creating an account, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p></div></section></main>;
}
