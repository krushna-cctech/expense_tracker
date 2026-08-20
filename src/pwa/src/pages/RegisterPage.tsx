import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '@expense-tracker/shared';
import { useAuth } from '../auth/useAuth';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = registerSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </button>
        <p className="muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
