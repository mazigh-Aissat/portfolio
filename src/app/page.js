'use client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateAuth } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const skills = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Express', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'Git', 'REST API', 'GraphQL', 'Tailwind CSS',
];

const STORAGE_KEY = 'portfolio_avatar';

export default function HomePage() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    dispatch(hydrateAuth());
    // Charger la photo sauvegardée dans localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAvatar(saved);
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image trop grande. Maximum 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setAvatar(base64);
      localStorage.setItem(STORAGE_KEY, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setAvatar(null);
    localStorage.removeItem(STORAGE_KEY);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <Navbar />
      <main className="page-wrapper">

        {/* ── Hero ── */}
        <section className="hero">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-content">
                <div className="hero-tag">
                  <span style={{ width: 8, height: 8, background: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
                  Disponible pour des projets
                </div>
                <h1 className="hero-title">
                  Bonjour, je suis<br />
                  <span className="name-highlight">Mazigh Aissat</span>
                </h1>
                <p className="hero-description">
                  Développeur Full Stack passionné par la création d&apos;applications web modernes,
                  performantes et accessibles. Je transforme des idées en expériences numériques remarquables.
                </p>
                <div className="hero-actions">
                  <Link href="/projects" className="btn btn-primary">
                    Voir mes projets
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  <a href="mailto:mazighaissat649@gmail.com" className="btn btn-outline">Me contacter</a>
                </div>
                <div className="skills-grid">
                  {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </div>

              {/* ── Avatar avec upload ── */}
              <div className="hero-avatar">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {/* Cercle principal */}
                  <div
                    className="avatar-ring"
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s', transform: hovering ? 'scale(1.03)' : 'scale(1)' }}
                  >
                    {avatar ? (
                      <div className="avatar-inner" style={{ padding: 0, overflow: 'hidden' }}>
                        <img
                          src={avatar}
                          alt="Photo de profil"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </div>
                    ) : (
                      <div className="avatar-inner">MA</div>
                    )}

                    {/* Overlay au hover */}
                    <div style={{
                      position: 'absolute', inset: 3, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      opacity: hovering ? 1 : 0,
                      transition: 'opacity 0.2s',
                      pointerEvents: 'none',
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
                        {avatar ? 'Changer la photo' : 'Ajouter une photo'}
                      </span>
                    </div>
                  </div>

                  {/* Bouton upload sous le cercle */}
                  <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        background: 'rgba(124,92,252,0.15)',
                        border: '1px solid rgba(124,92,252,0.4)',
                        color: 'var(--accent2)',
                        padding: '0.45rem 1rem',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        transition: 'all 0.2s',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.28)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,92,252,0.15)'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      {avatar ? 'Changer' : 'Ajouter une photo'}
                    </button>

                    {avatar && (
                      <button
                        onClick={handleRemove}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          color: 'var(--red)',
                          padding: '0.45rem 0.75rem',
                          borderRadius: 8,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        title="Supprimer la photo"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">À propos de moi</h2>
              <div className="section-divider" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {[
                { icon: '🎓', title: 'Formation', text: 'Étudiant en Informatique, spécialisé en développement logiciel et applications web.' },
                { icon: '💡', title: 'Expertise', text: 'Full Stack avec une forte affinité pour les technologies JavaScript modernes (React, Next.js, Node.js).' },
                { icon: '🚀', title: 'Objectif', text: 'Créer des produits digitaux innovants qui résolvent des problèmes concrets avec des expériences utilisateur exceptionnelles.' },
              ].map(item => (
                <div key={item.title} className="card card-body" style={{ padding: '2rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section">
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,92,252,0.15), rgba(167,139,250,0.08))',
              border: '1px solid rgba(124,92,252,0.25)',
              borderRadius: 20,
              padding: '3.5rem 2rem',
              textAlign: 'center',
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Laissez un témoignage</h2>
              <p style={{ color: 'var(--text2)', marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
                Vous avez travaillé avec moi ou suivi mon parcours ? Partagez votre expérience !
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/testimonials" className="btn btn-primary">Voir les témoignages</Link>
                <Link href="/testimonials/new" className="btn btn-outline">Laisser un avis</Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
