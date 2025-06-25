import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import useApi from '../services/api';

interface VideoSession {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  courseId: string;
  courseName: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  maxParticipants: number;
  participants: Participant[];
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  meetingLink: string;
  recordingUrl?: string;
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'biweekly' | 'monthly';
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'registered' | 'joined' | 'left';
  joinedAt?: string;
  leftAt?: string;
}

interface VideoSessionContextType {
  sessions: VideoSession[];
  userSessions: VideoSession[];
  instructorSessions: VideoSession[];
  createSession: (sessionData: Omit<VideoSession, 'id' | 'participants' | 'status' | 'meetingLink'>) => Promise<VideoSession>;
  updateSession: (id: string, sessionData: Partial<VideoSession>) => Promise<VideoSession>;
  deleteSession: (id: string) => Promise<void>;
  joinSession: (sessionId: string) => Promise<void>;
  leaveSession: (sessionId: string) => Promise<void>;
  startSession: (sessionId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
  getSessionById: (id: string) => VideoSession | undefined;
  isLoading: boolean;
  error: string | null;
}

const VideoSessionContext = createContext<VideoSessionContextType | undefined>(undefined);

export const useVideoSessions = () => {
  const context = useContext(VideoSessionContext);
  if (context === undefined) {
    throw new Error('useVideoSessions must be used within a VideoSessionProvider');
  }
  return context;
};

// Configuration pour le mode démo (sans backend)
const DEMO_MODE = true;

export const VideoSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const api = useApi();
  const [sessions, setSessions] = useState<VideoSession[]>([
    {
      id: '1',
      title: 'Atelier de Prononciation Espagnole',
      description: 'Session interactive axée sur la prononciation espagnole et l\'entraînement à l\'accent',
      instructorId: 'instructor-1',
      instructorName: 'Maria Rodriguez',
      courseId: '1',
      courseName: 'Espagnol Complet pour Débutants',
      scheduledDate: '2025-01-20',
      scheduledTime: '14:00',
      duration: 60,
      maxParticipants: 25,
      status: 'scheduled',
      meetingLink: 'https://meet.learnme.com/spanish-pronunciation-123',
      participants: [
        {
          id: 'student-1',
          name: 'Jean Dupont',
          email: 'jean@example.com',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          status: 'registered'
        },
        {
          id: 'student-2',
          name: 'Sophie Martin',
          email: 'sophie@example.com',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          status: 'registered'
        }
      ],
      isRecurring: false
    },
    {
      id: '2',
      title: 'Q&R Grammaire Française',
      description: 'Session hebdomadaire de questions-réponses sur la grammaire française',
      instructorId: 'instructor-2',
      instructorName: 'Pierre Dubois',
      courseId: '2',
      courseName: 'Maîtrise de la Conversation Française',
      scheduledDate: '2025-01-22',
      scheduledTime: '16:30',
      duration: 45,
      maxParticipants: 20,
      status: 'scheduled',
      meetingLink: 'https://meet.learnme.com/french-grammar-456',
      participants: [
        {
          id: 'student-3',
          name: 'Michael Chen',
          email: 'michael@example.com',
          avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          status: 'registered'
        }
      ],
      isRecurring: true,
      recurringPattern: 'weekly'
    },
    {
      id: '3',
      title: 'Conversation Allemande Avancée',
      description: 'Pratique de conversation pour les étudiants de niveau avancé',
      instructorId: 'instructor-3',
      instructorName: 'Hans Mueller',
      courseId: '3',
      courseName: 'Grammaire et Structure Allemandes',
      scheduledDate: '2025-01-25',
      scheduledTime: '18:00',
      duration: 90,
      maxParticipants: 15,
      status: 'scheduled',
      meetingLink: 'https://meet.learnme.com/german-conversation-789',
      participants: [],
      isRecurring: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les sessions depuis l'API
  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      if (!DEMO_MODE) {
        setIsLoading(true);
        try {
          let data;
          if (user.role === 'learner') {
            const response = await api.videoSessions.getStudentSessions();
            data = response.data;
          } else {
            const response = await api.videoSessions.getAllSessions();
            data = response.data;
          }
          setSessions(data);
        } catch (err) {
          console.error('Erreur lors du chargement des sessions:', err);
          setError('Impossible de charger les sessions');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSessions();
  }, [user]);

  // Filtrer les sessions en fonction du rôle de l'utilisateur
  const userSessions = user ? sessions.filter(session => {
    // Pour les apprenants, montrer les sessions auxquelles ils sont inscrits
    if (user.role === 'learner') {
      return session.participants.some(p => p.id === user.id);
    }
    // Pour les instructeurs, montrer les sessions qu'ils ont créées
    else if (user.role === 'instructor') {
      return session.instructorId === user.id;
    }
    // Pour les admins, montrer toutes les sessions
    else if (user.role === 'admin') {
      return true;
    }
    return false;
  }) : [];

  // Sessions spécifiques aux instructeurs
  const instructorSessions = user && user.role === 'instructor' 
    ? sessions.filter(session => session.instructorId === user.id)
    : [];

  const createSession = async (sessionData: Omit<VideoSession, 'id' | 'participants' | 'status' | 'meetingLink'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (DEMO_MODE) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newSession: VideoSession = {
          ...sessionData,
          id: Date.now().toString(),
          participants: [],
          status: 'scheduled',
          meetingLink: `https://meet.learnme.com/${sessionData.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
        };
        
        setSessions(prev => [...prev, newSession]);
        return newSession;
      } else {
        const response = await api.videoSessions.createSession(sessionData);
        const newSession = response.data;
        setSessions(prev => [...prev, newSession]);
        return newSession;
      }
    } catch (err) {
      setError('Erreur lors de la création de la session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = async (id: string, sessionData: Partial<VideoSession>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (DEMO_MODE) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const updatedSessions = sessions.map(session => 
          session.id === id ? { ...session, ...sessionData } : session
        );
        
        setSessions(updatedSessions);
        return updatedSessions.find(s => s.id === id) as VideoSession;
      } else {
        const response = await api.videoSessions.updateSession(id, sessionData);
        const updatedSession = response.data;
        
        setSessions(prev => prev.map(session => 
          session.id === id ? updatedSession : session
        ));
        
        return updatedSession;
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de la session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (DEMO_MODE) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setSessions(prev => prev.filter(session => session.id !== id));
      } else {
        await api.videoSessions.deleteSession(id);
        setSessions(prev => prev.filter(session => session.id !== id));
      }
    } catch (err) {
      setError('Erreur lors de la suppression de la session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinSession = async (sessionId: string) => {
    if (!user) {
      setError('Vous devez être connecté pour rejoindre une session');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (DEMO_MODE) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1) {
          throw new Error('Session non trouvée');
        }
        
        const session = sessions[sessionIndex];
        
        // Vérifier si l'utilisateur est déjà inscrit
        const isAlreadyRegistered = session.participants.some(p => p.id === user.id);
        
        if (!isAlreadyRegistered) {
          // Ajouter l'utilisateur aux participants
          const newParticipant: Participant = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            status: 'registered'
          };
          
          const updatedSessions = [...sessions];
          updatedSessions[sessionIndex] = {
            ...session,
            participants: [...session.participants, newParticipant]
          };
          
          setSessions(updatedSessions);
        }
        
        // Mettre à jour le statut du participant à 'joined'
        const updatedSessions = [...sessions];
        const participantIndex = updatedSessions[sessionIndex].participants.findIndex(p => p.id === user.id);
        
        if (participantIndex !== -1) {
          updatedSessions[sessionIndex].participants[participantIndex] = {
            ...updatedSessions[sessionIndex].participants[participantIndex],
            status: 'joined',
            joinedAt: new Date().toISOString()
          };
          
          setSessions(updatedSessions);
        }
      } else {
        await api.videoSessions.joinSession(sessionId);
        
        // Mettre à jour l'état local après la réponse de l'API
        const updatedSession = await api.videoSessions.getSessionById(sessionId);
        
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? updatedSession.data : session
        ));
      }
    } catch (err) {
      setError('Erreur lors de la participation à la session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveSession = async (sessionId: string) => {
    if (!user) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (DEMO_MODE) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);
        if (sessionIndex === -1) {
          throw new Error('Session non trouvée');
        }
        
        const session = sessions[sessionIndex];
        const participantIndex = session.participants.findIndex(p => p.id === user.id);
        
        if (participantIndex !== -1) {
          const updatedSessions = [...sessions];
          updatedSessions[sessionIndex].participants[participantIndex] = {
            ...updatedSessions[sessionIndex].participants[participantIndex],
            status: 'left',
            leftAt: new Date().toISOString()
          };
          
          setSessions(updatedSessions);
        }
      } else {
        await api.videoSessions.leaveSession(sessionId);
        
        // Mettre à jour l'état local après la réponse de l'API
        const updatedSession = await api.videoSessions.getSessionById(sessionId);
        
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? updatedSession.data : session
        ));
      }
    } catch (err) {
      setError('Erreur lors de la sortie de la session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (DEMO_MODE) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const updatedSessions = sessions.map(session => 
          session.id === sessionId ? { ...session, status: 'live' } : session
        );
        
        setSessions(updatedSessions);
      } else {
        await api.videoSessions.startSession(sessionId);
        
        // Mettre à jour l'état local après la réponse de l'API
        const updatedSession = await api.videoSessions.getSessionById(sessionId);
        
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? updatedSession.data : session
        ));
      }
    } catch (err) {
      setError('Erreur lors du démarrage de la session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (DEMO_MODE) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const updatedSessions = sessions.map(session => 
          session.id === sessionId ? { 
            ...session, 
            status: 'completed',
            recordingUrl: 'https://recordings.learnme.com/session-recording.mp4'
          } : session
        );
        
        setSessions(updatedSessions);
      } else {
        await api.videoSessions.endSession(sessionId);
        
        // Mettre à jour l'état local après la réponse de l'API
        const updatedSession = await api.videoSessions.getSessionById(sessionId);
        
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? updatedSession.data : session
        ));
      }
    } catch (err) {
      setError('Erreur lors de la fin de la session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionById = (id: string) => {
    return sessions.find(session => session.id === id);
  };

  return (
    <VideoSessionContext.Provider value={{
      sessions,
      userSessions,
      instructorSessions,
      createSession,
      updateSession,
      deleteSession,
      joinSession,
      leaveSession,
      startSession,
      endSession,
      getSessionById,
      isLoading,
      error
    }}>
      {children}
    </VideoSessionContext.Provider>
  );
};