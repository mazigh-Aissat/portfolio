'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser, clearErrors } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, errors, token } = useSelector(s => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  useEffect(() => {
    if (token) router.replace('/');
  }, [token, router]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched(t => ({ ...t, [e.target.name]: true }));

  // Client-side validation
  const clientErrors = {};
  if (touched.email && !form.email) clientErrors.email = 'L\'email est requis.';
  else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) clientErrors.email = 'Adresse courriel invalide.';
  if (touched.password && !form.password) clientErrors.password = 'Le mot de passe est requis.';

  const allErrors = { ...clientErrors, ...errors };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(clientErrors).length > 0) return;
    dispatch(loginUser(form));
  };

  return (
    <>
      <Navbar />
      <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div className="form-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
              <h1 className="form-title">Connexion</h1>
              <p className="form-subtitle">Accédez à votre espace personnel</p>
            </div>

            {allErrors.general && (
              <div className="alert alert-error">{allErrors.general}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Adresse courriel</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${allErrors.email ? 'error' : ''}`}
                  placeholder="mazigh@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
                {allErrors.email && <p className="form-error">⚠ {allErrors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-input ${allErrors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                />
                {allErrors.password && <p className="form-error">⚠ {allErrors.password}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <p className="form-footer">
              Pas encore de compte ? <Link href="/register">S&apos;inscrire</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
