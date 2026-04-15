'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProjects } from '@/store/slices/projectsSlice';
import { hydrateAuth } from '@/store/slices/authSlice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import withAuth from '@/components/withAuth';

const PROJECT_EMOJIS = ['🛒', '📋', '⛳'];

function ProjectsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, loading, error } = useSelector(s => s.projects);
  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (token) dispatch(fetchProjects());
  }, [dispatch, token]);

  return (
    <>
      <Navbar />
      <main className="page-wrapper">
        <div className="container">
          <div className="page-header">
            <h1>Mes Projets</h1>
            <p>Découvrez mes réalisations techniques et créatives</p>
          </div>

          {loading && (
            <div className="loading-dots">
              <span /><span /><span />
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ maxWidth: 500, margin: '0 auto' }}>
              Erreur lors du chargement des projets.
            </div>
          )}

          {!loading && list.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>Aucun projet trouvé</h3>
              <p>Les projets seront bientôt disponibles.</p>
            </div>
          )}

          <div className="projects-grid" style={{ paddingBottom: '4rem' }}>
            {list.map((project, i) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="project-image">
                  <span style={{ position: 'relative', zIndex: 1, fontSize: '3.5rem' }}>
                    {PROJECT_EMOJIS[i % PROJECT_EMOJIS.length]}
                  </span>
                </div>
                <div className="project-body">
                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-desc">{project.description}</p>
                  <div className="tech-tags">
                    {(project.technologies || []).map(t => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Link
                      href={`/projects/${project.id}`}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                      onClick={e => e.stopPropagation()}
                    >
                      Voir les détails →
                    </Link>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        onClick={e => e.stopPropagation()}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default withAuth(ProjectsPage);
