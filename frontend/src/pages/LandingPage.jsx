import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Target, GraduationCap, Share2, Award, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {/* Hero Section */}
            <section style={{
                textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '1.5rem', background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
            }}>
                <span style={{
                    background: 'var(--primary-color)', color: '#ffffff', padding: '0.25rem 1rem',
                    borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                    Plateforme Officielle V2
                </span>
                <h1 style={{
                    fontSize: '3.5rem', fontWeight: 800, maxWidth: '800px', lineHeight: 1.15,
                    fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--primary-color) 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                    Propulsez Votre Projet avec la Chambre des Icônes
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
                    Rejoignez le réseau officiel de la jeunesse entrepreneuriale. Accédez à des formations exclusives, à des mentorats, à des opportunités B2B et au Fonds de Croissance Stratégique (FCS).
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <Link to="/register" className="btn btn-primary glow-on-hover">
                        Adhérer Maintenant <ArrowRight size={16} />
                    </Link>
                    <Link to="/about" className="btn btn-outline">
                        En Savoir Plus
                    </Link>
                </div>
            </section>

            {/* Core Features Grid */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem' }}>Nos Services aux Membres</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Des outils taillés sur mesure pour stimuler votre croissance.</p>
                </div>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)'
                        }}>
                            <Shield size={24} />
                        </div>
                        <h3>Gestion des Adhésions</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Processus de candidature 100% digitalisé, transparent et conforme au statut du règlement intérieur.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-color)'
                        }}>
                            <Target size={24} />
                        </div>
                        <h3>Fonds de Croissance (FCS)</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Soumettez vos demandes de financement, suivez vos déblocages et gérez vos remboursements en ligne.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)'
                        }}>
                            <GraduationCap size={24} />
                        </div>
                        <h3>Formations & Mentorat</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Cours en ligne (vidéos, quiz), examens, certificats et mise en relation directe avec des mentors experts.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981'
                        }}>
                            <Share2 size={24} />
                        </div>
                        <h3>Réseau & B2B</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Marketplace intégrée, opportunités d'affaires exclusives et messagerie directe sécurisée entre membres.
                        </p>
                    </div>
                </div>
            </section>

            {/* Collèges Section */}
            <section className="glass-card" style={{
                padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem',
                border: '1px solid var(--border-glass)', background: 'radial-gradient(circle at top right, rgba(14, 165, 233, 0.05) 0%, transparent 60%)'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Award size={36} color="var(--accent-color)" style={{ alignSelf: 'center' }} />
                    <h2 style={{ fontSize: '1.75rem' }}>Les Collèges de l'Entreprise</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Nos membres sont regroupés en collèges dynamiques selon leur secteur d'activité et la maturité de leur structure pour favoriser des synergies optimales.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
                    <div style={{ padding: '1rem' }}>
                        <h4 style={{ color: 'var(--primary-color)', fontSize: '1.25rem' }}>PME / PMI</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Industries & Services Structurés</p>
                    </div>
                    <div style={{ padding: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                        <h4 style={{ color: 'var(--secondary-color)', fontSize: '1.25rem' }}>Startups</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Innovation & Technologies</p>
                    </div>
                    <div style={{ padding: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                        <h4 style={{ color: 'var(--accent-color)', fontSize: '1.25rem' }}>Artisanat</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Métiers d'Art & Production Locale</p>
                    </div>
                    <div style={{ padding: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                        <h4 style={{ color: '#10b981', fontSize: '1.25rem' }}>Agri-Preneurs</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Agriculture & Agro-alimentaire</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
