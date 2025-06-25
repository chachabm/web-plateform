import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api';

// Créer des en-têtes avec authentification
const createAuthHeaders = (token) => {
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Fonction générique pour les requêtes API
export const apiRequest = async (endpoint, options = {}, token = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createAuthHeaders(token);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Erreur HTTP! statut: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Erreur API (${endpoint}):`, error);
    throw error;
  }
};

// Hook personnalisé pour utiliser l'API avec authentification
export const useApi = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('authToken');
  
  const authApiRequest = async (endpoint, options = {}) => {
    return apiRequest(endpoint, options, token);
  };
  
  // API des sessions vidéo
  const videoSessionsApi = {
    getAllSessions: (params) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return authApiRequest(`/video-sessions${queryString}`);
    },
    
    getStudentSessions: (params) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      return authApiRequest(`/video-sessions/student${queryString}`);
    },
    
    getSessionById: (id) => authApiRequest(`/video-sessions/${id}`),
    
    createSession: (sessionData) => authApiRequest('/video-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    }),
    
    updateSession: (id, sessionData) => authApiRequest(`/video-sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData)
    }),
    
    deleteSession: (id) => authApiRequest(`/video-sessions/${id}`, {
      method: 'DELETE'
    }),
    
    joinSession: (id) => authApiRequest(`/video-sessions/${id}/join`, {
      method: 'POST'
    }),
    
    leaveSession: (id) => authApiRequest(`/video-sessions/${id}/leave`, {
      method: 'POST'
    }),
    
    startSession: (id) => authApiRequest(`/video-sessions/${id}/start`, {
      method: 'POST'
    }),
    
    endSession: (id) => authApiRequest(`/video-sessions/${id}/end`, {
      method: 'POST'
    }),
    
    addMaterial: (id, materialData) => authApiRequest(`/video-sessions/${id}/materials`, {
      method: 'POST',
      body: JSON.stringify(materialData)
    }),
    
    getAnalytics: (id) => authApiRequest(`/video-sessions/${id}/analytics`)
  };
  
  return {
    videoSessions: videoSessionsApi
  };
};

export default useApi;