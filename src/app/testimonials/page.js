'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchTestimonials, deleteTestimonial } from '@/store/slices/testimonialsSlice';
import { hydrateAuth } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import withAuth from '@/components/withAuth';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ color: n <= rating ? 'var(--gold)' : 'var(--text3)' }}>★</span>
      ))}
    </div>
  );
}

function TestimonialsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.testimonials);
  const { token, user } = useSelector(s => s.auth);
  const [deletingId, setDeletingId] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => { dispatch(hydrateAuth()); }, [dispatch]);
  useEffect(() => { if (token) dispatch(fetchTestimonials()); }, [dispatch, token]);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce témoignage ?')) return;
    setDeletingId(id);
    await dispatch(deleteTestimonial(id));
    setDeletingId(null);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <div className="page-header">
            <h1>Témoignages</h1>
            <p>Ce que les gens disent de mon travail</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <Link href="/testimonials/new" className="btn btn-primary">
              + Laisser un témoignage
            </Link>
          </div>

          {loading && <div className="loading-dots"><span /><span /><span /></div>}

          {!loading && list.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Aucun témoignage pour l&apos;instant</h3>
              <p>Soyez le premier à laisser un avis !</p>
              <Link href="/testimonials/new" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                Laisser un témoignage
              </Link>
            </div>
          )}

          <div className="testimonials-grid" style={{ paddingBottom: '4rem' }}>
            {list.map(t => (
              <div key={t.id} className="testimonial-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <p className="testimonial-author">{t.author}</p>
                    <p className="testimonial-date">{formatDate(t.createdAt)}</p>
                  </div>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'white', fontSize: '0.9rem', flexShrink: 0,
                  }}>
                    {t.author.charAt(0).toUpperCase()}
                  </div>
                </div>
                <Stars rating={t.rating} />
                <p className="testimonial-message">&ldquo;{t.message}&rdquo;</p>
                {user && t.userId === user.id && (
                  <div className="testimonial-actions">
                    <Link
                      href={`/testimonials/new?edit=${t.id}`}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      ✏ Modifier
                    </Link>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                    >
                      {deletingId === t.id ? '...' : '🗑 Supprimer'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default withAuth(TestimonialsPage);
