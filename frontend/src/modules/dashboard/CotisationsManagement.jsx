import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { api } from '../../utils/api';
import { CreditCard, Smartphone, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const CotisationsManagement = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCotisation, setSelectedCotisation] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Mobile Money');
    const [phone, setPhone] = useState(user?.phone || '');
    const [paying, setPaying] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchCotisations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/cotisations');
            setData(res);
        } catch (err) {
            console.error('Error fetching cotisations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCotisations();
    }, []);

    const handlePaySubmit = async (e) => {
        e.preventDefault();
        if (!selectedCotisation) return;

        setPaying(true);
        setMessage(null);
        try {
            const res = await api.post('/cotisations', {
                cotisation_id: selectedCotisation.id,
                payment_method: paymentMethod,
                phone: phone,
            });
            setMessage(`Paiement effectué avec succès! Réf: ${res.reference}`);
            setSelectedCotisation(null);
            fetchCotisations();
        } catch (err) {
            console.error('Payment error:', err);
            setMessage(err.message || 'Le paiement a échoué.');
        } finally {
            setPaying(false);
        }
    };

    const handleVerify = async (paymentId) => {
        try {
            await api.put(`/cotisations/verify/${paymentId}`);
            setMessage('Paiement validé avec succès.');
            fetchCotisations();
        } catch (err) {
            console.error('Verification error:', err);
            setMessage('Erreur lors de la validation du paiement.');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement des cotisations...</div>;
    }

    // --- Admin View ---
    if (user?.role === 'super_admin') {
        const { cotisations, stats } = data || { cotisations: [], stats: {} };
        return (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Suivi des Cotisations Annuelles</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Visualisez les collectes de cotisations et validez manuellement les transactions en attente.</p>
                </div>

                {/* Stats Dashboard */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collecté (FCFA)</span>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
                            {stats?.total_collected?.toLocaleString() || 0}
                        </h3>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>En Attente (FCFA)</span>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-color)', marginTop: '0.25rem' }}>
                            {stats?.total_pending?.toLocaleString() || 0}
                        </h3>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Membres à jour</span>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-color)', marginTop: '0.25rem' }}>
                            {stats?.paid_count || 0}
                        </h3>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Membres non payés</span>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444', marginTop: '0.25rem' }}>
                            {stats?.unpaid_count || 0}
                        </h3>
                    </div>
                </div>

                {message && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary-color)' }}>
                        {message}
                    </div>
                )}

                <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1rem' }}>Membre / Entreprise</th>
                                <th style={{ padding: '1rem' }}>Année</th>
                                <th style={{ padding: '1rem' }}>Montant</th>
                                <th style={{ padding: '1rem' }}>Statut</th>
                                <th style={{ padding: '1rem' }}>Dernière mise à jour</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cotisations.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{c.member_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.company_name}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{c.year}</td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{c.amount.toLocaleString()} FCFA</td>
                                    <td style={{ padding: '1rem' }}>
                                        {c.status === 'paid' ? (
                                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}><CheckCircle size={14} /> Réglé</span>
                                        ) : (
                                            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}><AlertCircle size={14} /> Impayé</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(c.updated_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // --- Member View ---
    const { cotisations = [], payments = [] } = data || {};

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            {/* List and Payment section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mes Cotisations Annuelles</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Consultez votre état financier et réglez votre cotisation obligatoire de 50 000 FCFA.</p>
                </div>

                {message && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary-color)' }}>
                        {message}
                    </div>
                )}

                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cotisations.map((c) => (
                        <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Cotisation Annuelle {c.year}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{c.amount.toLocaleString()} FCFA</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {c.status === 'paid' ? (
                                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}><CheckCircle size={16} /> Payé</span>
                                ) : (
                                    <button onClick={() => setSelectedCotisation(c)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                        Payer
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {cotisations.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>Aucune cotisation émise.</div>
                    )}
                </div>

                {/* Simulated Payment Modal/Form */}
                {selectedCotisation && (
                    <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--primary-color)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Règlement Cotisation - {selectedCotisation.year}</h3>
                        <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Mode de règlement</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                                        <input type="radio" name="method" checked={paymentMethod === 'Mobile Money'} onChange={() => setPaymentMethod('Mobile Money')} />
                                        <Smartphone size={16} /> Mobile Money (Momo / Orange)
                                    </label>
                                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                                        <input type="radio" name="method" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} />
                                        <CreditCard size={16} /> Carte Bancaire
                                    </label>
                                </div>
                            </div>

                            {paymentMethod === 'Mobile Money' && (
                                <div className="form-group">
                                    <label className="form-label" htmlFor="phone">Numéro Mobile Money (Cameroun)</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="form-input"
                                        placeholder="Ex: 699 555 444"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setSelectedCotisation(null)} className="btn btn-outline" style={{ flex: 1 }}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary glow-on-hover" style={{ flex: 1.5 }} disabled={paying}>
                                    {paying ? 'Traitement...' : 'Confirmer le paiement'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Payment history list */}
            <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Historique des paiements</h3>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {payments.map((p) => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{p.payment_method}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Ref: {p.transaction_reference}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700 }}>{p.amount.toLocaleString()} FCFA</div>
                                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Succès</div>
                            </div>
                        </div>
                    ))}
                    {payments.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>Aucun paiement enregistré.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CotisationsManagement;
