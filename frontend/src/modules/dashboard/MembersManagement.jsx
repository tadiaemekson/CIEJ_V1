import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { api } from '../../utils/api';
import { Search, UserCheck, UserX, AlertTriangle, ShieldCheck } from 'lucide-react';

const MembersManagement = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [collegeFilter, setCollegeFilter] = useState('');
    const [message, setMessage] = useState(null);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const params = [];
            if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
            if (collegeFilter) params.push(`college=${encodeURIComponent(collegeFilter)}`);
            
            const queryString = params.length ? `?${params.join('&')}` : '';
            const data = await api.get(`/members${queryString}`);
            setMembers(data);
        } catch (err) {
            console.error('Error fetching members:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [collegeFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMembers();
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/members/${id}`, { status });
            setMessage(`Statut du membre mis à jour à: ${status}`);
            fetchMembers();
        } catch (err) {
            console.error('Error updating member status:', err);
            setMessage('Erreur lors de la mise à jour du membre.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>Actif</span>;
            case 'suspended':
                return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 700 }}>Suspendu</span>;
            default:
                return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(148, 163, 184, 0.1)', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>Inactif</span>;
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                    {user?.role === 'super_admin' ? 'Gestion des Membres & Rôles' : 'Annuaire B2B & Collaborations'}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {user?.role === 'super_admin' 
                        ? 'Contrôlez les accès des membres de la chambre, attribuez des rôles ou appliquez des sanctions.' 
                        : 'Explorez la liste des entrepreneurs adhérents de la CIEJ, contactez-les et développez vos synergies.'}
                </p>
            </div>

            {message && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                    {message}
                </div>
            )}

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Rechercher nom, entreprise, code..."
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>Rechercher</button>
                </form>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filtrer par collège:</span>
                    <select
                        className="form-input"
                        style={{ width: '180px', padding: '0.5rem 1rem' }}
                        value={collegeFilter}
                        onChange={(e) => setCollegeFilter(e.target.value)}
                    >
                        <option value="">Tous les collèges</option>
                        <option value="Startup">Startup</option>
                        <option value="PME-PMI">PME / PMI</option>
                        <option value="Artisanat">Artisanat</option>
                        <option value="Agri-preneur">Agri-preneur</option>
                    </select>
                </div>
            </div>

            {/* Table / Grid list */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Recherche en cours...</div>
            ) : (
                <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1rem' }}>Membre / Code</th>
                                <th style={{ padding: '1rem' }}>Entreprise / Secteur</th>
                                <th style={{ padding: '1rem' }}>Collège</th>
                                <th style={{ padding: '1rem' }}>Contact</th>
                                <th style={{ padding: '1rem' }}>Statut</th>
                                {user?.role === 'super_admin' && <th style={{ padding: '1rem' }}>Actions de contrôle</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((m) => (
                                <tr key={m.member_id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            {m.name}
                                            {m.role === 'super_admin' && <ShieldCheck size={14} color="var(--primary-color)" title="Admin" />}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                            {m.member_code || 'En attente'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{m.company_name || '-'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.sector || '-'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{m.college_name || '-'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.85rem' }}>{m.email}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.phone || '-'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{getStatusBadge(m.member_status)}</td>
                                    
                                    {user?.role === 'super_admin' && (
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {m.member_status === 'active' ? (
                                                    <button onClick={() => handleUpdateStatus(m.member_id, 'suspended')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                                                        <UserX size={12} /> Suspendre
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleUpdateStatus(m.member_id, 'active')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                                        <UserCheck size={12} /> Activer
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan={user?.role === 'super_admin' ? 6 : 5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Aucun membre correspondant trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MembersManagement;
