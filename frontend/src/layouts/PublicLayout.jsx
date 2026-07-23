import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Shield, Users, Calendar, Award, MapPin, Phone, Mail } from 'lucide-react';

const PublicLayout = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header navbar */}
            <header className="glass-card" style={{
                position: 'sticky', top: 0, zIndex: 100, borderRadius: 0,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1rem 2rem', margin: 0, borderBottom: '1px solid var(--border-glass)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.png" alt="CIEJ Logo" style={{ height: '36px' }} />
                </div>
                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Accueil</Link>
                    <Link to="/directory" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Annuaire</Link>
                    <Link to="/about" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>À Propos</Link>
                    <Link to="/faq" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>FAQ</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                Espace Membre
                            </Link>
                            <button onClick={logout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Connexion</Link>
                            <Link to="/register" className="btn btn-primary glow-on-hover" style={{ padding: '0.5rem 1.25rem' }}>
                                Devenir Membre
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Main content */}
            <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#06140e',
                color: '#94a3b8',
                padding: '4rem 2rem 2rem',
                borderTop: '1px solid rgba(16, 185, 129, 0.1)',
                marginTop: 'auto',
                fontFamily: 'var(--font-body)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    textAlign: 'left'
                }}>
                    {/* Column 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src="/logo.png" alt="CIEJ Logo" style={{ height: '36px' }} />
                        </div>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#cbd5e1' }}>
                            La Chambre des Icônes de l'Entrepreneuriat Jeune (CIEJ) est l'organisation nationale regroupant les leaders économiques émergents du Cameroun.
                        </p>
                        <span style={{ fontStyle: 'italic', fontWeight: 600, color: '#4ade80', fontSize: '0.95rem' }}>
                            « Excellence - Synergie - Impact »
                        </span>
                        
                        {/* WhatsApp link button */}
                        <a href="https://wa.me/237699555444" target="_blank" rel="noopener noreferrer" style={{
                            width: '40px', height: '40px', borderRadius: '8px', 
                            backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(16, 185, 129, 0.2)', transition: 'all 0.2s ease',
                            marginTop: '0.5rem',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#10b981';
                            e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                            e.currentTarget.style.color = '#10b981';
                        }}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.013-5.035-2.856-6.88C16.638 2.146 14.195 1.13 11.602 1.13c-5.45 0-9.875 4.369-9.878 9.73-.001 1.902.5 3.753 1.45 5.353L2.16 21.75l5.59-1.467h-.103zm10.663-7.513c-.228-.115-1.353-.669-1.562-.746-.21-.077-.362-.115-.514.115-.152.23-.589.746-.723.899-.133.152-.267.168-.495.053-.228-.115-.963-.356-1.835-1.134-.679-.606-1.138-1.355-1.272-1.587-.133-.23-.015-.354.1-.468.103-.103.228-.268.342-.403.114-.134.152-.229.228-.382.076-.153.038-.287-.019-.402-.057-.115-.514-1.24-.704-1.697-.186-.447-.372-.387-.514-.393-.133-.007-.285-.007-.438-.007-.152 0-.401.057-.61.287-.21.23-.8.784-.8 1.91 0 1.127.82 2.215.933 2.368.114.153 1.61 2.46 3.902 3.45.545.235.97.375 1.303.481.548.174 1.047.15 1.441.09.44-.067 1.353-.553 1.544-1.087.19-.533.19-1.01.133-1.105-.057-.095-.21-.153-.438-.268z"/>
                            </svg>
                        </a>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h4 style={{ color: '#4ade80', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', fontWeight: 700 }}>
                            Chambre
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link to="/directory" style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Membres Actifs</Link></li>
                            <li><Link to="/about" style={{ color: '#94a3b8', fontSize: '0.95rem' }}>À Propos de nous</Link></li>
                            <li><Link to="/about" style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Gouvernance</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h4 style={{ color: '#4ade80', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', fontWeight: 700 }}>
                            Adhésion & Aide
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link to="/register" style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Demander mon adhésion</Link></li>
                            <li><Link to="/login" style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Connexion Espace Membre</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h4 style={{ color: '#4ade80', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', fontWeight: 700 }}>
                            Secrétariat
                        </h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.95rem', color: '#cbd5e1' }}>
                                <MapPin size={18} style={{ color: '#ec4899', flexShrink: 0, marginTop: '0.2rem' }} />
                                <span>Rue de la Chambre, Yaoundé</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.95rem', color: '#cbd5e1' }}>
                                <Phone size={18} style={{ color: '#ec4899', flexShrink: 0 }} />
                                <span>+237 699 555 444</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.95rem', color: '#cbd5e1' }}>
                                <Mail size={18} style={{ color: '#cbd5e1', flexShrink: 0 }} />
                                <span>contact@chambredesicones.cm</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Sub-footer copyright bar */}
                <div style={{
                    maxWidth: '1200px',
                    margin: '3rem auto 0',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    fontSize: '0.8rem',
                    color: '#64748b'
                }}>
                    <p>&copy; {new Date().getFullYear()} CIEJ. Tous droits réservés.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link to="/terms" style={{ color: '#64748b' }}>Conditions d'Utilisation</Link>
                        <Link to="/privacy" style={{ color: '#64748b' }}>Confidentialité</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
