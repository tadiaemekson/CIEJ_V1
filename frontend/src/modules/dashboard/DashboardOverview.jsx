import React from 'react';
import { useAuth } from '../../store/AuthContext';
import { Award, CreditCard, ShieldCheck, Briefcase, FileText, ChevronRight } from 'lucide-react';

const DashboardOverview = () => {
    const { user } = useAuth();

    // Mock stats
    const stats = [
        { label: 'Adhésion Statut', value: 'Validé', icon: ShieldCheck, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        { label: 'Cotisation 2026', value: 'À Jour', icon: CreditCard, color: 'var(--primary-color)', bg: 'rgba(99, 102, 241, 0.1)' },
        { label: 'Collège', value: user?.college || 'Startup', icon: Briefcase, color: 'var(--secondary-color)', bg: 'rgba(14, 165, 233, 0.1)' },
        { label: 'Financement FCS', value: '0 FCFA', icon: Award, color: 'var(--accent-color)', bg: 'rgba(245, 158, 11, 0.1)' },
    ];

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Welcome banner */}
            <div className="glass-card" style={{
                padding: '2.5rem', background: 'var(--primary-gradient)', color: '#ffffff',
                border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h2 style={{ color: '#ffffff', fontSize: '2rem', fontWeight: 800 }}>
                        Content de vous revoir, {user?.name || 'Entrepreneur'} !
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', maxWidth: '600px' }}>
                        Bienvenue sur la plateforme officielle CIEJ V2. Vous pouvez piloter vos dossiers de financement FCS, vous inscrire aux formations et événements à venir, ou négocier des opportunités B2B.
                    </p>
                </div>
                <div style={{ fontSize: '3.5rem', opacity: 0.2, fontWeight: 900, userSelect: 'none' }}>
                    CIEJ
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px', backgroundColor: stat.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color
                            }}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                                    {stat.label}
                                </span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.15rem' }}>
                                    {stat.value}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main panels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
                {/* Enterprise details */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Mon Entreprise</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Raison Sociale</span>
                            <p style={{ fontWeight: 600 }}>{user?.company_name || 'Non Spécifiée'}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collège d'Affiliation</span>
                            <p style={{ fontWeight: 600 }}>{user?.college || 'Non Affilié'}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Description d'activité</span>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {user?.description || "Aucune description fournie. Mettez à jour vos informations pour figurer dans l'annuaire B2B."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick actions / news */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Actions Rapides</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)',
                            cursor: 'pointer', hover: { borderColor: 'var(--primary-color)' }
                        }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <FileText size={20} color="var(--primary-color)" />
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Payer ma cotisation</h4>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cotisation annuelle V2</span>
                                </div>
                            </div>
                            <ChevronRight size={16} color="var(--text-muted)" />
                        </div>

                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)',
                            cursor: 'pointer'
                        }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Award size={20} color="var(--secondary-color)" />
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Demande de financement FCS</h4>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Soumettre un dossier de projet</span>
                                </div>
                            </div>
                            <ChevronRight size={16} color="var(--text-muted)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
