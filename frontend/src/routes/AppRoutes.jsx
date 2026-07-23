import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../modules/auth/LoginPage';
import RegisterPage from '../modules/auth/RegisterPage';
import DashboardOverview from '../modules/dashboard/DashboardOverview';

// Dashboard / Admin Modules
import AdhesionManagement from '../modules/dashboard/AdhesionManagement';
import MembersManagement from '../modules/dashboard/MembersManagement';
import CotisationsManagement from '../modules/dashboard/CotisationsManagement';
import EventsManagement from '../modules/dashboard/EventsManagement';
import FormationsManagement from '../modules/dashboard/FormationsManagement';
import FcsManagement from '../modules/dashboard/FcsManagement';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Chargement de l'espace membre...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Guest Route Wrapper (Prevents logged-in users from visiting login/register)
const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
                
                {/* Guest-only routes */}
                <Route path="login" element={
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                } />
                <Route path="register" element={
                    <GuestRoute>
                        <RegisterPage />
                    </GuestRoute>
                } />
                
                {/* Fallbacks */}
                <Route path="about" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>À Propos de CIEJ</h2><p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Chambre des Icônes de l'Entrepreneuriat Jeune. Version V2.</p></div>} />
                <Route path="directory" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>Annuaire des Entrepreneurs</h2><p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Recherchez et contactez les membres officiels.</p></div>} />
                <Route path="faq" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>Foire Aux Questions</h2><p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Toutes les réponses à vos questions.</p></div>} />
            </Route>

            {/* Protected Espace Membre Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<DashboardOverview />} />
                <Route path="adhesion" element={<AdhesionManagement />} />
                <Route path="members" element={<MembersManagement />} />
                <Route path="cotisations" element={<CotisationsManagement />} />
                <Route path="events" element={<EventsManagement />} />
                <Route path="formations" element={<FormationsManagement />} />
                <Route path="fcs" element={<FcsManagement />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
