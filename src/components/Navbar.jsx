'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  // Pages publiques : on cache les liens protégés
  const isPublicPage = pathname === '/login' || pathname === '/register';

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const isActive = (href) => pathname === href ? 'active' : '';

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">MA.</Link>
      <ul className="nav-links">

        {/* Liens visibles seulement si connecté (pas sur login/register) */}
        {!isPublicPage && (
          <>
            <li><Link href="/" className={isActive('/')}>Accueil</Link></li>
            <li><Link href="/projects" className={isActive('/projects')}>Projets</Link></li>
            <li><Link href="/testimonials" className={isActive('/testimonials')}>Témoignages</Link></li>
          </>
        )}

        {user ? (
          <>
            <li>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: 'var(--text2)', fontSize: '0.85rem' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                {user.name}
              </span>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/login" className={isActive('/login')}>Connexion</Link></li>
            <li><Link href="/register" className={`nav-btn ${isActive('/register')}`}>S&apos;inscrire</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
