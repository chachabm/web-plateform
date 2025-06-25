import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configuration pour le mode démo (sans backend)
const DEMO_MODE = true; // Changé à true pour utiliser le mode démo sans backend

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = async () => {
      try {
        if (DEMO_MODE) {
          // Mode démo : vérifier localStorage
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } else {
          // Mode production : vérifier avec le backend
          const savedToken = localStorage.getItem('authToken');
          
          if (savedToken) {
            // Validate token with backend
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${savedToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
            } else {
              // Token is invalid, clear it
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      if (DEMO_MODE) {
        // Mode démo : simulation de connexion
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler délai réseau
        
        // Créer un utilisateur de démonstration basé sur l'email
        let role = 'learner';
        if (email.includes('admin')) {
          role = 'admin';
        } else if (email.includes('instructor') || email.includes('teacher')) {
          role = 'instructor';
        }
        
        const demoUser: User = {
          id: Date.now().toString(),
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email: email,
          role: role as 'learner' | 'instructor' | 'admin',
          joinedDate: new Date().toISOString(),
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        };
        
        // Sauvegarder dans localStorage
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
        // Message de bienvenue
        setTimeout(() => {
          alert(`🎉 Connexion réussie !\n\nBienvenue ${demoUser.name} ! Vous êtes maintenant connecté en mode démo.`);
        }, 500);
        
      } else {
        // Mode production : vraie API
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Store user data and token
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setIsLoading(true);
    
    try {
      if (DEMO_MODE) {
        // Mode démo : simulation d'inscription
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler délai réseau
        
        const demoUser: User = {
          id: Date.now().toString(),
          name: name,
          email: email,
          role: role as 'learner' | 'instructor' | 'admin',
          joinedDate: new Date().toISOString(),
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        };
        
        // Account created successfully and saved to localStorage
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        
      } else {
        // Mode production : vraie API
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password, role })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        
        // Account created successfully and saved to database
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('authToken', data.token);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    // Show logout confirmation
    setTimeout(() => {
      alert('Vous avez été déconnecté avec succès. Merci d\'avoir utilisé LearnMe !');
    }, 100);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};