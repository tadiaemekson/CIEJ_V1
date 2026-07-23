import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { api } from '../../utils/api';
import { Calendar, MapPin, Ticket, UserCheck, Plus, Check } from 'lucide-react';

const EventsManagement = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Admin create event state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('0');
    const [capacity, setCapacity] = useState('100');

    // Admin scan state
    const [scanTicketCode, setScanTicketCode] = useState('');

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await api.get('/events');
            setEvents(data);
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', {
                title,
                description,
                start_time: startTime,
                end_time: endTime,
                location,
                price: parseFloat(price),
                capacity: parseInt(capacity),
            });
            setMessage('Nouvel événement programmé avec succès.');
            setShowCreateForm(false);
            // Reset
            setTitle('');
            setDescription('');
            setStartTime('');
            setEndTime('');
            setLocation('');
            fetchEvents();
        } catch (err) {
            console.error('Error creating event:', err);
            setMessage(err.message || 'Erreur lors de la programmation.');
        }
    };

    const handleRegister = async (eventId) => {
        try {
            const res = await api.post(`/events/register/${eventId}`);
            setMessage(`Inscription réussie! Code Ticket: ${res.ticket_code}`);
            fetchEvents();
        } catch (err) {
            console.error('Error registering for event:', err);
            setMessage(err.message || "L'inscription a échoué.");
        }
    };

    const handleScanCheckIn = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/events/checkin', { ticket_code: scanTicketCode });
            setMessage(res.message);
            setScanTicketCode('');
            fetchEvents();
        } catch (err) {
            console.error('Check-in error:', err);
            setMessage(err.message || 'Erreur de check-in / Ticket invalide.');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement des événements...</div>;
    }

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            
            {/* Events List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Agenda CIEJ</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Découvrez et participez aux salons d'affaires, réunions et sommets.</p>
                    </div>
                    {user?.role === 'super_admin' && (
                        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                            <Plus size={16} /> Nouveau
                        </button>
                    )}
                </div>

                {message && (
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary-color)' }}>
                        {message}
                    </div>
                )}

                {/* Create Event Form Card */}
                {showCreateForm && (
                    <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--primary-color)' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Programmer un nouvel événement</h3>
                        <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">Titre de l'événement</label>
                                <input id="title" className="form-input" placeholder="Ex: Salon B2B Emergence" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="desc">Description</label>
                                <textarea id="desc" className="form-input" style={{ minHeight: '80px' }} placeholder="Présentez les objectifs de la session..." value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="start">Début</label>
                                    <input id="start" type="datetime-local" className="form-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="end">Fin</label>
                                    <input id="end" type="datetime-local" className="form-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="loc">Lieu de l'événement</label>
                                <input id="loc" className="form-input" placeholder="Ex: Palais des Congrès, Yaoundé" value={location} onChange={(e) => setLocation(e.target.value)} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="price">Prix (FCFA)</label>
                                    <input id="price" type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="cap">Capacité d'accueil</label>
                                    <input id="cap" type="number" className="form-input" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setShowCreateForm(false)} className="btn btn-outline" style={{ flex: 1 }}>Annuler</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>Programmer</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Event Card Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {events.map((e) => (
                        <div key={e.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{e.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{e.description}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} color="var(--primary-color)" />
                                    <span>{new Date(e.start_time).toLocaleString()} - {new Date(e.end_time).toLocaleTimeString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={16} color="var(--primary-color)" />
                                    <span>{e.location}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <span style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                                    {e.price > 0 ? `${e.price.toLocaleString()} FCFA` : 'Gratuit'}
                                </span>
                                
                                {user?.role === 'super_admin' ? (
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {e.registrations_count} inscrit(s)
                                    </span>
                                ) : (
                                    <div>
                                        {e.is_registered ? (
                                            <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                                <Ticket size={16} /> Inscrit
                                            </span>
                                        ) : (
                                            <button onClick={() => handleRegister(e.id)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                                S'inscrire
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Ticket Code Display */}
                            {e.is_registered && e.ticket && (
                                <div style={{
                                    padding: '1rem', backgroundColor: 'var(--bg-color)', border: '1px dashed var(--border-color)', 
                                    borderRadius: 'var(--border-radius-sm)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem'
                                }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Mon billet d'entrée (Code)</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                                        {e.ticket.ticket_code}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: e.ticket.attended ? '#10b981' : 'var(--text-muted)' }}>
                                        {e.ticket.attended ? '✓ Validé à l\'accueil' : 'Présentez ce code pour check-in'}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                    {events.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Aucun événement programmé.</div>
                    )}
                </div>
            </div>

            {/* Admin Ticket Scanning Panel */}
            {user?.role === 'super_admin' && (
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Check-in & Validation Billets</h3>
                    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Saisissez le code du billet présenté par le participant pour enregistrer sa présence en temps réel.
                        </p>
                        <form onSubmit={handleScanCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" htmlFor="ticket">Code du Ticket</label>
                                <input
                                    id="ticket"
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: CIEJ-TKT-ABCD1234"
                                    value={scanTicketCode}
                                    onChange={(e) => setScanTicketCode(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary glow-on-hover" style={{ width: '100%' }}>
                                <UserCheck size={18} /> Valider la présence
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsManagement;
