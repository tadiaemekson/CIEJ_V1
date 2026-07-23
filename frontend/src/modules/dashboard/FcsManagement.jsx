import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { api } from '../../utils/api';
import { Award, Percent, Calendar, ShieldCheck, FileText, Check, X } from 'lucide-react';

const FcsManagement = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Member form state
    const [reqAmount, setReqAmount] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Admin review state
    const [selectedApp, setSelectedApp] = useState(null);
    const [approvedAmount, setApprovedAmount] = useState('');
    const [committeeNotes, setCommitteeNotes] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await api.get('/fcs');
            setApplications(data);
        } catch (err) {
            console.error('Error fetching FCS applications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleApply = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            await api.post('/fcs', {
                requested_amount: parseFloat(reqAmount),
                project_description: projectDesc,
            });
            setMessage('Demande de financement soumise avec succès au comité d\'évaluation.');
            setReqAmount('');
            setProjectDesc('');
            fetchApplications();
        } catch (err) {
            console.error('FCS application error:', err);
            setMessage(err.message || 'La soumission a échoué.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEvaluate = async (status) => {
        if (!selectedApp) return;

        setUpdating(true);
        setMessage(null);
        try {
            await api.put(`/fcs/${selectedApp.id}`, {
                status,
                approved_amount: approvedAmount ? parseFloat(approvedAmount) : null,
                committee_notes: committeeNotes,
            });
            setMessage(`Dossier FCS mis à jour avec le statut: ${status}`);
            setSelectedApp(null);
            setApprovedAmount('');
            setCommitteeNotes('');
            fetchApplications();
        } catch (err) {
            console.error('FCS evaluation error:', err);
            setMessage('Erreur lors de la validation du financement.');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>Approuvé</span>;
            case 'disbursed':
                return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 700 }}>Fonds débloqués</span>;
            case 'rejected':
                return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>Rejeté</span>;
            case 'under_review':
                return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 700 }}>En cours d'étude</span>;
            default:
                return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>Soumis</span>;
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement des dossiers FCS...</div>;
    }

    // --- Admin View ---
    if (user?.role === 'super_admin') {
        return (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Validation du Fonds de Croissance Stratégique (FCS)</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Évaluez les demandes de financement, déterminez le capital alloué et suivez les échéances de remboursement.</p>
                </div>

                {message && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary-color)' }}>
                        {message}
                    </div>
                )}

                {/* Loan Evaluation Panel */}
                {selectedApp && (
                    <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--primary-color)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                            Évaluation de la demande de {selectedApp.applicant_name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                            Capital sollicité: <span style={{ fontWeight: 700 }}>{selectedApp.requested_amount.toLocaleString()} FCFA</span>
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="app_amount">Montant Approuvé (FCFA)</label>
                                <input
                                    id="app_amount"
                                    type="number"
                                    className="form-input"
                                    placeholder="Ex: 5000000"
                                    value={approvedAmount}
                                    onChange={(e) => setApprovedAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="notes">Décision & Recommandations du Comité</label>
                                <textarea
                                    id="notes"
                                    className="form-input"
                                    style={{ minHeight: '80px' }}
                                    placeholder="Justification, taux, conditions de remboursement..."
                                    value={committeeNotes}
                                    onChange={(e) => setCommitteeNotes(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setSelectedApp(null)} className="btn btn-outline" style={{ flex: 1 }}>Annuler</button>
                                <button type="button" onClick={() => handleEvaluate('approved')} className="btn btn-primary" style={{ flex: 1 }} disabled={updating}>Approuver</button>
                                <button type="button" onClick={() => handleEvaluate('disbursed')} className="btn btn-secondary" style={{ flex: 1 }} disabled={updating}>Débloquer fonds</button>
                                <button type="button" onClick={() => handleEvaluate('rejected')} className="btn btn-outline" style={{ flex: 1, color: '#ef4444', borderColor: '#ef4444' }} disabled={updating}>Rejeter</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Applications Table */}
                <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1rem' }}>Candidat / Entreprise</th>
                                <th style={{ padding: '1rem' }}>Projet / Description</th>
                                <th style={{ padding: '1rem' }}>Montant Sollicité</th>
                                <th style={{ padding: '1rem' }}>Montant Approuvé</th>
                                <th style={{ padding: '1rem' }}>Statut</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{app.applicant_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.company_name}</div>
                                    </td>
                                    <td style={{ padding: '1rem', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.project_description}>
                                        {app.project_description}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{app.requested_amount.toLocaleString()} FCFA</td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{app.approved_amount ? `${app.approved_amount.toLocaleString()} FCFA` : '-'}</td>
                                    <td style={{ padding: '1rem' }}>{getStatusBadge(app.status)}</td>
                                    <td style={{ padding: '1rem' }}>
                                        {app.status === 'submitted' || app.status === 'under_review' || app.status === 'approved' ? (
                                            <button onClick={() => { setSelectedApp(app); setApprovedAmount(app.approved_amount || app.requested_amount); }} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                                Évaluer
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clôturé</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Aucun dossier FCS en cours d'évaluation.
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
    const userApplications = applications;

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            
            {/* Loan Request Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Demande de Financement FCS</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Soumettez un dossier de demande de prêt au Fonds de Croissance Stratégique (taux bonifié, accompagnement technique de la CIEJ).
                    </p>
                </div>

                {message && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary-color)' }}>
                        {message}
                    </div>
                )}

                <div className="glass-card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="req_amount">Capital Sollicité (FCFA)</label>
                            <input
                                id="req_amount"
                                type="number"
                                className="form-input"
                                placeholder="Min: 100 000 FCFA"
                                value={reqAmount}
                                onChange={(e) => setReqAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="p_desc">Plan de financement / Description du Projet</label>
                            <textarea
                                id="p_desc"
                                className="form-input"
                                style={{ minHeight: '120px', resize: 'vertical' }}
                                placeholder="Présentez l'objectif de cet emprunt: achat de matériel, besoin en fonds de roulement, développement produit, et vos projections..."
                                value={projectDesc}
                                onChange={(e) => setProjectDesc(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary glow-on-hover" disabled={submitting}>
                            {submitting ? 'Envoi...' : 'Soumettre le dossier de financement'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Application List & payback terms */}
            <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Mes Dossiers de Financement</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {userApplications.map((app) => (
                        <div key={app.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{app.requested_amount.toLocaleString()} FCFA</span>
                                {getStatusBadge(app.status)}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.project_description}</p>
                            
                            {app.approved_amount && (
                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Montant alloué:</span>
                                        <span style={{ fontWeight: 700 }}>{app.approved_amount.toLocaleString()} FCFA</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Taux d'intérêt:</span>
                                        <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>2.5% (Bonifié)</span>
                                    </div>
                                </div>
                            )}

                            {app.committee_notes && (
                                <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.8rem' }}>
                                    <span style={{ fontWeight: 700, display: 'block', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Observations Comité</span>
                                    <p style={{ marginTop: '0.2rem' }}>{app.committee_notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {userApplications.length === 0 && (
                        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Aucun dossier de financement soumis au FCS pour le moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FcsManagement;
