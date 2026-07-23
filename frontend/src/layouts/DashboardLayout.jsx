import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LayoutDashboard, Users, CreditCard, Calendar, GraduationCap, Award, Settings, LogOut, ShieldAlert, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = user?.role === 'super_admin' ? [
        { name: 'Administration', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Dossiers d\'Adhésion', path: '/dashboard/adhesion', icon: ShieldAlert },
        { name: 'Membres & Rôles', path: '/dashboard/members', icon: Users },
        { name: 'Suivi Cotisations', path: '/dashboard/cotisations', icon: CreditCard },
        { name: 'Gestion Événements', path: '/dashboard/events', icon: Calendar },
        { name: 'Gestion Formations', path: '/dashboard/formations', icon: GraduationCap },
        { name: 'Financements FCS', path: '/dashboard/fcs', icon: Award },
    ] : [
        { name: 'Vue d\'ensemble', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Mon Dossier d\'Adhésion', path: '/dashboard/adhesion', icon: ShieldAlert },
        { name: 'Membres & Annuaire B2B', path: '/dashboard/members', icon: Users },
        { name: 'Mes Cotisations', path: '/dashboard/cotisations', icon: CreditCard },
        { name: 'Événements', path: '/dashboard/events', icon: Calendar },
        { name: 'Formations', path: '/dashboard/formations', icon: GraduationCap },
        { name: 'Fonds FCS', path: '/dashboard/fcs', icon: Award },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            {/* Left Sidebar Overlay Backdrop for Mobile */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', 
                        backdropFilter: 'blur(4px)', zIndex: 98
                    }}
                />
            )}

            {/* Left Sidebar */}
            <aside className={`dashboard-sidebar glass-card ${isSidebarOpen ? 'active' : ''}`}>
                {/* Logo area */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <img src="/logo.png" alt="CIEJ Logo" style={{ height: '36px' }} />
                    <button 
                        className="sidebar-toggle" 
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav Menu */}
                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)',
                                    color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                    fontWeight: isActive ? 700 : 500,
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <Icon size={18} />
                                <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar footer / User profile */}
                <div style={{
                    padding: '1.5rem', borderTop: '1px solid var(--border-color)',
                    display: 'flex', flexDirection: 'column', gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'var(--primary-gradient)', color: '#ffffff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem'
                        }}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <h5 style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'Utilisateur'}
                            </h5>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'capitalize' }}>
                                {user?.role || 'Membre'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                    >
                        <LogOut size={16} />
                        <span style={{ fontSize: '0.85rem' }}>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main content pane */}
            <div className="dashboard-content">
                {/* Header Navbar */}
                <header className="glass-card" style={{
                    borderRadius: 0, borderBottom: '1px solid var(--border-glass)',
                    padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', height: 'var(--header-height)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button 
                            className="sidebar-toggle" 
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Menu size={20} />
                        </button>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {user?.role === 'super_admin' ? 'Espace Secrétariat / Admin' : 'Espace Membre'}
                        </h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{
                            fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem',
                            borderRadius: '100px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            Compte Actif
                        </span>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            ID: <span style={{ fontWeight: 700 }}>#{user?.id || '2026'}</span>
                        </div>
                    </div>
                </header>

                {/* Viewport content */}
                <main style={{ flex: 1, padding: '2.5rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
