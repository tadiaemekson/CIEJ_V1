import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { User, Mail, Lock, Phone, Briefcase, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [college, setCollege] = useState('Startup');
    const [description, setDescription] = useState('');

    const handleNext = (e) => {
        e.preventDefault();
        setError(null);
        if (!name || !email || !password || !phone) {
            setError('Veuillez remplir toutes les informations personnelles.');
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setError(null);
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!companyName || !college) {
            setError("Veuillez remplir les informations concernant l'entreprise.");
            return;
        }

        setLoading(true);
        try {
            await register({
                name,
                email,
                password,
                phone,
                company_name: companyName,
                college,
                description
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Une erreur est survenue lors de la création du compte.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '3rem 0', minHeight: 'calc(100vh - 200px)'
        }}>
            <div className="glass-card" style={{
                width: '100%', maxWidth: '500px', padding: '2.5rem',
                border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-lg)'
            }}>
                {/* Step indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                            fontWeight: 700, backgroundColor: step === 1 ? 'var(--primary-color)' : '#10b981',
                            color: '#ffffff'
                        }}>
                            {step > 1 ? '✓' : '1'}
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: step === 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            Fondateur
                        </span>
                    </div>
                    <div style={{ height: '1px', width: '40px', backgroundColor: 'var(--border-color)', alignSelf: 'center' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                            fontWeight: 700, backgroundColor: step === 2 ? 'var(--primary-color)' : 'var(--border-color)',
                            color: step === 2 ? '#ffffff' : 'var(--text-muted)'
                        }}>
                            2
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: step === 2 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            Entreprise
                        </span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo.png" alt="CIEJ Logo" style={{ height: '48px', marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Devenir Membre</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {step === 1 ? 'Créons d\'abord votre profil personnel' : 'Parlez-nous de votre structure'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444', fontSize: '0.875rem', marginBottom: '1.5rem', alignItems: 'center'
                    }}>
                        <ShieldAlert size={20} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Nom Complet</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} color="var(--text-muted)" style={{
                                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'
                                }} />
                                <input
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    type="text"
                                    id="name"
                                    placeholder="Ex: Jean Dupont"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Professionnel</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} color="var(--text-muted)" style={{
                                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'
                                }} />
                                <input
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    type="email"
                                    id="email"
                                    placeholder="nom@entreprise.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="phone">Téléphone / WhatsApp</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} color="var(--text-muted)" style={{
                                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'
                                }} />
                                <input
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    type="tel"
                                    id="phone"
                                    placeholder="+237 6xx xxx xxx"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Mot de passe</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} color="var(--text-muted)" style={{
                                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'
                                }} />
                                <input
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    type="password"
                                    id="password"
                                    placeholder="Min. 8 caractères"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary glow-on-hover" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Continuer
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="companyName">Nom de l'Entreprise</label>
                            <div style={{ position: 'relative' }}>
                                <Briefcase size={18} color="var(--text-muted)" style={{
                                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'
                                }} />
                                <input
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    type="text"
                                    id="companyName"
                                    placeholder="Ex: Tech Solutions S.A.R.L"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="college">Collège d'Entreprise</label>
                            <select
                                className="form-input"
                                id="college"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                required
                            >
                                <option value="PME-PMI">PME / PMI (Services & Production)</option>
                                <option value="Startup">Startup (Technologies & Innovation)</option>
                                <option value="Artisanat">Artisanat (Métiers d'art & Production Locale)</option>
                                <option value="Agri-preneur">Agri-preneur (Agro-alimentaire & Elevage)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Activités et objectifs de l'entreprise</label>
                            <div style={{ position: 'relative' }}>
                                <FileText size={18} color="var(--text-muted)" style={{
                                    position: 'absolute', left: '12px', top: '12px'
                                }} />
                                <textarea
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem', minHeight: '100px', resize: 'vertical' }}
                                    id="description"
                                    placeholder="Présentez brièvement ce que produit ou propose votre structure..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button type="button" onClick={handleBack} className="btn btn-outline" style={{ flex: 1 }}>
                                Retour
                            </button>
                            <button type="submit" className="btn btn-primary glow-on-hover" style={{ flex: 1.5 }} disabled={loading}>
                                {loading ? 'Création...' : 'Soumettre le dossier'}
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Déjà inscrit ?{' '}
                    <Link to="/login" style={{ fontWeight: 600 }}>
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
