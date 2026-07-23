import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Lock, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
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
                width: '100%', maxWidth: '420px', padding: '2.5rem',
                border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo.png" alt="CIEJ Logo" style={{ height: '48px', marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Connexion</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Accédez à votre Espace Membre CIEJ V2
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

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email professionnel</label>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label className="form-label" style={{ marginBottom: 0 }} htmlFor="password">Mot de passe</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                Oublié ?
                            </Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="var(--text-muted)" style={{
                                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'
                            }} />
                            <input
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary glow-on-hover"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Pas encore membre ?{' '}
                    <Link to="/register" style={{ fontWeight: 600 }}>
                        Créer un dossier d'adhésion
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
