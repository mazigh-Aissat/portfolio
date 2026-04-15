'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProjectById } from '@/store/slices/projectsSlice';
import { hydrateAuth } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import withAuth from '@/components/withAuth';

const PROJECT_EMOJIS = { 1: '🛒', 2: '📋', 3: '⛳' };

function ProjectDetailPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { current, loading, error } = useSelector(s => s.projects);
  const { token } = useSelector(s => s.auth);

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => { if (token && id) dispatch(fetchProjectById(id)); }, [dispatch, token, id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-wrapper">
          <div className="loading-dots"><span /><span /><span /></div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !current) {
    return (
      <>
        <Navbar />
        <main className="page-wrapper">
          <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text2)' }}>Projet introuvable.</p>
            <Link href="/projects" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Retour aux projets
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <div className="detail-hero">
            <Link href="/projects" className="back-btn">
              ← Retour aux projets
            </Link>

            <div className="project-detail-banner">
              {PROJECT_EMOJIS[current.id] || '💡'}
            </div>

            <h1 className="detail-title">{current.title}</h1>

            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '2rem',
              marginBottom: '2rem',
            }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>
                Description
              </h2>
              <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                {current.description}
              </p>
            </div>

            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '2rem',
              marginBottom: '2rem',
            }}>
              <h2 style={{ fontSize: '0.85rem', marginBottom: '1.25rem', color: 'var(--text2)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Technologies utilisées
              </h2>
              <div className="tech-tags">
                {(current.technologies || []).map(t => (
                  <span key={t} className="tech-tag" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="detail-links">
              {current.github && (
                <a href={current.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  Voir sur GitHub
                </a>
              )}
              {current.demo && (
                <a href={current.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  🌐 Voir la démo live
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default withAuth(ProjectDetailPage);
