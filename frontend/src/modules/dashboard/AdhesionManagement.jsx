import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { api } from '../../utils/api';
import { ShieldCheck, ShieldAlert, Clock, Check, X, FileText } from 'lucide-react';

const AdhesionManagement = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewNotes, setReviewNotes] = useState('');
    const [message, setMessage] = useState(null);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await api.get('/adhesions');
            setApplications(Array.isArray(data) ? data : [data]);
        } catch (err) {
            console.error('Error fetching applications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await api.put(`/adhesions/${id}`, {
                status,
                notes: reviewNotes,
            });
            setMessage(`Dossier mis à jour avec le statut: ${status}`);
            setReviewNotes('');
            fetchApplications();
        } catch (err) {
            console.error('Error updating application status:', err);
            setMessage('Erreur lors du traitement du dossier.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '100px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600, fontSize: '0.8rem' }}><ShieldCheck size={14} /> Validé</span>;
            case 'verified':
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '100px', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--secondary-color)', fontWeight: 600, fontSize: '0.8rem' }}><Clock size={14} /> Vérifié</span>;
            case 'rejected':
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '100px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 600, fontSize: '0.8rem' }}><ShieldAlert size={14} /> Rejeté</span>;
            default:
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.75rem', borderRadius: '100px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.8rem' }}><Clock size={14} /> En cours</span>;
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement des dossiers d'adhésion...</div>;
    }

    // --- Admin View ---
    if (user?.role === 'super_admin') {
        return (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Suivi des Candidatures d'Adhésion</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Validez ou rejetez les demandes d'admission des entrepreneurs selon le règlement intérieur.</p>
                </div>

                {message && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                        {message}
                    </div>
                )}

                <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1rem' }}>Candidat</th>
                                <th style={{ padding: '1rem' }}>Entreprise</th>
                                <th style={{ padding: '1rem' }}>Collège</th>
                                <th style={{ padding: '1rem' }}>Statut</th>
                                <th style={{ padding: '1rem' }}>Description</th>
                                <th style={{ padding: '1rem' }}>Actions de validation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{app.applicant_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.applicant_email}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{app.company_name}</td>
                                    <td style={{ padding: '1rem' }}>{app.college}</td>
                                    <td style={{ padding: '1rem' }}>{getStatusBadge(app.status)}</td>
                                    <td style={{ padding: '1rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.description}>
                                        {app.description || '-'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {app.status === 'pending' ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Notes / Justificatif..."
                                                    className="form-input"
                                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                                                    onChange={(e) => setReviewNotes(e.target.value)}
                                                />
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => handleAction(app.id, 'approved')} className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', flex: 1 }}>
                                                        <Check size={14} /> Valider
                                                    </button>
                                                    <button onClick={() => handleAction(app.id, 'rejected')} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444', flex: 1 }}>
                                                        <X size={14} /> Rejeter
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Traité</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Aucune candidature soumise pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // --- Member View ---
    const userApp = applications[0];

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mon Dossier d'Adhésion</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Suivez le statut de validation de votre candidature d'entrée à la CIEJ.</p>
            </div>

            {userApp ? (
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <span style={{ fontWeight: 600 }}>Statut du Dossier</span>
                        {getStatusBadge(userApp.status)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Raison Sociale</span>
                            <p style={{ fontWeight: 600 }}>{userApp.company_name}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collège Cible</span>
                            <p style={{ fontWeight: 600 }}>{userApp.college}</p>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Description d'activité</span>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{userApp.description || 'Aucune description.'}</p>
                        </div>
                        {userApp.notes && (
                            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderLeft: '3px solid var(--primary-color)', borderRadius: 'var(--border-radius-sm)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>Notes du Secrétariat</span>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{userApp.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <FileText size={48} color="var(--text-muted)" />
                    <h3>Aucune candidature soumise</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vous n'avez pas encore soumis de candidature d'adhésion.</p>
                    <button onClick={() => fetchApplications()} className="btn btn-primary">Rafraîchir</button>
                </div>
            )}
        </div>
    );
};

export default AdhesionManagement;
