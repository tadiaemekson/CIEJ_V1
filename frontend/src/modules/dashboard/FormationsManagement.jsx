import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { api } from '../../utils/api';
import { BookOpen, Video, FileText, CheckCircle, Plus, ChevronRight } from 'lucide-react';

const FormationsManagement = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [message, setMessage] = useState(null);

    // Admin states for course creation
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [courseDesc, setCourseDesc] = useState('');
    const [instructor, setInstructor] = useState('');

    // Admin states for module/lesson addition
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [targetModuleId, setTargetModuleId] = useState('');
    const [lessonTitle, setLessonTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await api.get('/courses');
            setCourses(data);
            if (data.length > 0 && !selectedCourse) {
                setSelectedCourse(data[0]);
                if (data[0].modules?.length > 0 && data[0].modules[0].lessons?.length > 0) {
                    setActiveLesson(data[0].modules[0].lessons[0]);
                }
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/courses', {
                title: courseTitle,
                description: courseDesc,
                instructor_name: instructor,
            });
            setMessage('Formation ajoutée avec succès.');
            setCourseTitle('');
            setCourseDesc('');
            setInstructor('');
            setShowCreateCourse(false);
            
            // Auto create a default module for this new course
            await api.post('/courses/modules', {
                formation_id: res.course_id,
                title: 'Module 1: Introduction',
                order_index: 1
            });
            
            fetchCourses();
        } catch (err) {
            console.error('Error creating course:', err);
            setMessage('Erreur lors de la création de la formation.');
        }
    };

    const handleAddLessonSubmit = async (e) => {
        e.preventDefault();
        if (!targetModuleId) return;

        try {
            await api.post('/courses/lessons', {
                module_id: parseInt(targetModuleId),
                title: lessonTitle,
                video_url: videoUrl,
                pdf_url: pdfUrl,
                order_index: 99
            });
            setMessage('Leçon insérée avec succès.');
            setLessonTitle('');
            setVideoUrl('');
            setPdfUrl('');
            setShowAddLesson(false);
            fetchCourses();
        } catch (err) {
            console.error('Error creating lesson:', err);
            setMessage('Erreur lors de la création de la leçon.');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Chargement des formations...</div>;
    }

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
            
            {/* Sidebar list of courses & modules */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Formations</h3>
                    {user?.role === 'super_admin' && (
                        <button onClick={() => setShowCreateCourse(!showCreateCourse)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                            + Nouvelle
                        </button>
                    )}
                </div>

                {message && (
                    <div style={{ padding: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', color: 'var(--primary-color)', fontSize: '0.75rem' }}>
                        {message}
                    </div>
                )}

                {/* Courses List Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {courses.map((course) => (
                        <button
                            key={course.id}
                            onClick={() => {
                                setSelectedCourse(course);
                                if (course.modules?.length > 0 && course.modules[0].lessons?.length > 0) {
                                    setActiveLesson(course.modules[0].lessons[0]);
                                } else {
                                    setActiveLesson(null);
                                }
                            }}
                            style={{
                                textAlign: 'left', padding: '0.75rem 1rem', border: '1px solid var(--border-color)',
                                borderRadius: 'var(--border-radius-sm)', cursor: 'pointer',
                                backgroundColor: selectedCourse?.id === course.id ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
                                color: selectedCourse?.id === course.id ? 'var(--primary-color)' : 'var(--text-primary)',
                                fontWeight: selectedCourse?.id === course.id ? 700 : 500
                            }}
                        >
                            <BookOpen size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                            {course.title}
                        </button>
                    ))}
                </div>

                {/* Course Modules and Lessons Tree */}
                {selectedCourse && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Structure du cours</span>
                        </div>
                        {selectedCourse.modules?.map((mod) => (
                            <div key={mod.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{mod.title}</h4>
                                    {user?.role === 'super_admin' && (
                                        <button onClick={() => { setTargetModuleId(mod.id); setShowAddLesson(true); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                                            + Leçon
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', paddingLeft: '0.5rem' }}>
                                    {mod.lessons?.map((less) => (
                                        <button
                                            key={less.id}
                                            onClick={() => setActiveLesson(less)}
                                            style={{
                                                textAlign: 'left', padding: '0.4rem 0.75rem', border: 'none', background: 'none',
                                                borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                color: activeLesson?.id === less.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                                                backgroundColor: activeLesson?.id === less.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                                fontSize: '0.8rem', fontWeight: activeLesson?.id === less.id ? 700 : 500
                                            }}
                                        >
                                            <Video size={12} />
                                            <span>{less.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </aside>

            {/* Course Content Viewport */}
            <main>
                {showCreateCourse && (
                    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Ajouter une formation</h3>
                        <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="title">Titre de la Formation</label>
                                <input id="title" className="form-input" placeholder="Ex: Finance d'entreprise" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="inst">Formateur / Intervenant</label>
                                <input id="inst" className="form-input" placeholder="Ex: M. Jean Kamdem" value={instructor} onChange={(e) => setInstructor(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="desc">Description générale</label>
                                <textarea id="desc" className="form-input" style={{ minHeight: '80px' }} placeholder="Objectifs et public cible..." value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary">Créer la formation</button>
                        </form>
                    </div>
                )}

                {showAddLesson && (
                    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Ajouter une leçon</h3>
                        <form onSubmit={handleAddLessonSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="ltitle">Titre de la Leçon</label>
                                <input id="ltitle" className="form-input" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="vurl">Code URL Vidéo (YouTube ID ou URL)</label>
                                <input id="vurl" className="form-input" placeholder="Ex: dQw4w9WgXcQ" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="purl">Lien PDF Support de Cours</label>
                                <input id="purl" className="form-input" placeholder="Ex: https://example.com/handout.pdf" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary">Enregistrer la leçon</button>
                        </form>
                    </div>
                )}

                {activeLesson ? (
                    <div className="glass-card animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                                Cours : {selectedCourse?.title}
                            </span>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{activeLesson.title}</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                Par <span style={{ fontWeight: 700 }}>{selectedCourse?.instructor_name}</span>
                            </p>
                        </div>

                        {/* Video Player Box */}
                        {activeLesson.video_url ? (
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--border-radius-md)', backgroundColor: '#000000' }}>
                                <iframe
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    src={`https://www.youtube.com/embed/${activeLesson.video_url}`}
                                    title={activeLesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div style={{ height: '300px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                Aucun support vidéo pour cette leçon.
                            </div>
                        )}

                        {/* Handout files */}
                        {activeLesson.pdf_url && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <FileText size={20} color="var(--primary-color)" />
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Support de cours (PDF)</h4>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notes de révision et exercices pratiques</span>
                                    </div>
                                </div>
                                <a href={activeLesson.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                    Télécharger
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <BookOpen size={48} color="var(--text-muted)" />
                        <h3>Aucune leçon sélectionnée</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sélectionnez un cours et cliquez sur une leçon pour commencer à réviser.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FormationsManagement;
