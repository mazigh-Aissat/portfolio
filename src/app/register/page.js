'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser, clearErrors } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, errors, token } = useSelector(s => s.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({});

  useEffect(() => { dispatch(clearErrors()); }, [dispatch]);
  useEffect(() => { if (token) router.replace('/'); }, [token, router]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched(t => ({ ...t, [e.target.name]: true }));

  const clientErrors = {};
  if (touched.name && (!form.name || form.name.trim().length < 2)) clientErrors.name = 'Le nom doit contenir au moins 2 caractères.';
  if (touched.email && !form.email) clientErrors.email = 'L\'email est requis.';
  else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) clientErrors.email = 'Adresse courriel invalide.';
  if (touched.password && form.password.length < 8) clientErrors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
  if (touched.confirm && form.confirm !== form.password) clientErrors.confirm = 'Les mots de passe ne correspondent pas.';

  const allErrors = { ...clientErrors, ...errors };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (Object.keys(clientErrors).length > 0 || form.confirm !== form.password) return;
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
  };

  return (
    <>
      <Navbar />
      <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div className="form-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
              <h1 className="form-title">Inscription</h1>
              <p className="form-subtitle">Créez votre compte gratuitement</p>
            </div>

            {allErrors.general && <div className="alert alert-error">{allErrors.general}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nom complet</label>
                <input
                  id="name" name="name" type="text"
                  className={`form-input ${allErrors.name ? 'error' : ''}`}
                  placeholder="Mazigh Aissat"
                  value={form.name} onChange={handleChange} onBlur={handleBlur}
                  autoComplete="name"
                />
                {allErrors.name && <p className="form-error">⚠ {allErrors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Adresse courriel</label>
                <input
                  id="email" name="email" type="email"
                  className={`form-input ${allErrors.email ? 'error' : ''}`}
                  placeholder="mazigh@example.com"
                  value={form.email} onChange={handleChange} onBlur={handleBlur}
                  autoComplete="email"
                />
                {allErrors.email && <p className="form-error">⚠ {allErrors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Mot de passe</label>
                <input
                  id="password" name="password" type="password"
                  className={`form-input ${allErrors.password ? 'error' : ''}`}
                  placeholder="Min. 8 caractères"
                  value={form.password} onChange={handleChange} onBlur={handleBlur}
                  autoComplete="new-password"
                />
                {allErrors.password && <p className="form-error">⚠ {allErrors.password}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm">Confirmer le mot de passe</label>
                <input
                  id="confirm" name="confirm" type="password"
                  className={`form-input ${allErrors.confirm ? 'error' : ''}`}
                  placeholder="Répétez votre mot de passe"
                  value={form.confirm} onChange={handleChange} onBlur={handleBlur}
                  autoComplete="new-password"
                />
                {allErrors.confirm && <p className="form-error">⚠ {allErrors.confirm}</p>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
                disabled={loading}
              >
                {loading ? 'Inscription...' : 'Créer mon compte'}
              </button>
            </form>

            <p className="form-footer">
              Déjà un compte ? <Link href="/login">Se connecter</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
