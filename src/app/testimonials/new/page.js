'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { createTestimonial, updateTestimonial, clearTestimonialErrors } from '@/store/slices/testimonialsSlice';
import { hydrateAuth } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import withAuth from '@/components/withAuth';

function TestimonialFormPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEdit = Boolean(editId);

  const { errors: storeErrors } = useSelector(s => s.testimonials);
  const { token } = useSelector(s => s.auth);

  const [form, setForm] = useState({ author: '', message: '', rating: 5 });
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(hydrateAuth());
    dispatch(clearTestimonialErrors());
  }, [dispatch]);

  // Load existing testimonial for edit
  useEffect(() => {
    if (isEdit && token) {
      setLoadingExisting(true);
      axios.get(`/api/testimonials/${editId}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      }).then(res => {
        setForm({ author: res.data.author, message: res.data.message, rating: res.data.rating });
      }).catch(() => {}).finally(() => setLoadingExisting(false));
    }
  }, [isEdit, editId, token]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleBlur = (e) => setTouched(t => ({ ...t, [e.target.name]: true }));
  const setRating = (r) => setForm(f => ({ ...f, rating: r }));

  const clientErrors = {};
  if (touched.author && (!form.author || form.author.trim().length < 2)) clientErrors.author = 'Le nom doit contenir au moins 2 caractères.';
  if (touched.message && (!form.message || form.message.trim().length < 10)) clientErrors.message = 'Le message doit contenir au moins 10 caractères.';

  const allErrors = { ...clientErrors, ...storeErrors };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ author: true, message: true });
    if (Object.keys(clientErrors).length > 0) return;

    setLoading(true);
    let result;
    if (isEdit) {
      result = await dispatch(updateTestimonial({ id: editId, data: form }));
    } else {
      result = await dispatch(createTestimonial(form));
    }
    setLoading(false);

    if (!result.error) {
      setSuccess(true);
      setTimeout(() => router.push('/testimonials'), 1200);
    }
  };

  if (loadingExisting) {
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

  return (
    <>
      <Navbar />
      <main className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div className="form-wrapper">
            <Link href="/testimonials" className="back-btn" style={{ display: 'inline-flex', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              ← Retour aux témoignages
            </Link>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{isEdit ? '✏️' : '💬'}</div>
              <h1 className="form-title">{isEdit ? 'Modifier le témoignage' : 'Laisser un témoignage'}</h1>
              <p className="form-subtitle">Partagez votre expérience avec moi</p>
            </div>

            {success && <div className="alert alert-success">✅ {isEdit ? 'Témoignage modifié' : 'Témoignage ajouté'} avec succès !</div>}
            {allErrors.general && <div className="alert alert-error">{allErrors.general}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="author">Votre nom</label>
                <input
                  id="author" name="author" type="text"
                  className={`form-input ${allErrors.author ? 'error' : ''}`}
                  placeholder="Jean Dupont"
                  value={form.author} onChange={handleChange} onBlur={handleBlur}
                />
                {allErrors.author && <p className="form-error">⚠ {allErrors.author}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Votre note</label>
                <div className="stars-input">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" className={form.rating >= n ? 'active' : ''} onClick={() => setRating(n)}>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Votre message</label>
                <textarea
                  id="message" name="message"
                  className={`form-textarea ${allErrors.message ? 'error' : ''}`}
                  placeholder="Partagez votre expérience... (min. 10 caractères)"
                  value={form.message} onChange={handleChange} onBlur={handleBlur}
                  rows={5}
                />
                {allErrors.message && <p className="form-error">⚠ {allErrors.message}</p>}
                <p style={{ color: 'var(--text3)', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                  {form.message.length} caractère{form.message.length !== 1 ? 's' : ''}
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={loading || success}
              >
                {loading ? 'Envoi...' : isEdit ? 'Mettre à jour' : 'Envoyer le témoignage'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default withAuth(TestimonialFormPage);
