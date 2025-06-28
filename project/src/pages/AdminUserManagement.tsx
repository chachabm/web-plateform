import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  User,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'instructor' | 'admin';
  avatar: string;
  isActive: boolean;
  joinedDate: string;
  lastLogin?: string;
}

const AdminUserManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Simuler le chargement des utilisateurs depuis l'API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // En mode démo, utiliser des données fictives
        const mockUsers: UserData[] = [
          {
            id: '1',
            name: 'Jean Dupont',
            email: 'jean@example.com',
            role: 'learner',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            isActive: true,
            joinedDate: '2024-12-01T10:30:00Z',
            lastLogin: '2025-01-15T08:45:00Z'
          },
          {
            id: '2',
            name: 'Sophie Martin',
            email: 'sophie@example.com',
            role: 'learner',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            isActive: true,
            joinedDate: '2024-11-15T14:20:00Z',
            lastLogin: '2025-01-14T16:30:00Z'
          },
          {
            id: '3',
            name: 'Maria Rodriguez',
            email: 'maria@example.com',
            role: 'instructor',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            isActive: true,
            joinedDate: '2024-10-05T09:15:00Z',
            lastLogin: '2025-01-16T11:20:00Z'
          },
          {
            id: '4',
            name: 'Pierre Dubois',
            email: 'pierre@example.com',
            role: 'instructor',
            avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            isActive: true,
            joinedDate: '2024-09-20T11:45:00Z',
            lastLogin: '2025-01-15T14:10:00Z'
          },
          {
            id: '5',
            name: 'Admin User',
            email: 'admin@learnme.com',
            role: 'admin',
            avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            isActive: true,
            joinedDate: '2024-01-01T00:00:00Z',
            lastLogin: '2025-01-16T09:30:00Z'
          },
          {
            id: '6',
            name: 'Michel Blanc',
            email: 'michel@example.com',
            role: 'learner',
            avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            isActive: false,
            joinedDate: '2024-08-10T16:20:00Z',
            lastLogin: '2024-12-05T10:15:00Z'
          }
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        setErrorMessage('Erreur lors du chargement des utilisateurs');
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Filtrer les utilisateurs en fonction des critères de recherche
  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && user.isActive) ||
                           (statusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    // Trier les utilisateurs
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'oldest':
          return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
        case 'newest':
        default:
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      }
    });
    
    setFilteredUsers(sorted);
  }, [users, searchTerm, roleFilter, statusFilter, sortBy]);

  const handleCreateUser = () => {
    setEditingUser({
      id: '',
      name: '',
      email: '',
      role: 'learner',
      avatar: '',
      isActive: true,
      joinedDate: new Date().toISOString()
    });
    setShowUserForm(true);
  };

  const handleEditUser = (userData: UserData) => {
    setEditingUser(userData);
    setShowUserForm(true);
  };

  const handleDeleteUser = (userId: string) => {
    setShowDeleteConfirm(userId);
  };

  const confirmDeleteUser = (userId: string) => {
    // Vérifier que l'utilisateur n'est pas en train de se supprimer lui-même
    if (userId === user?.id) {
      setErrorMessage('Vous ne pouvez pas supprimer votre propre compte');
      setShowDeleteConfirm(null);
      return;
    }
    
    // Vérifier que l'utilisateur n'est pas en train de supprimer un autre admin
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.role === 'admin' && user?.id !== userId) {
      setErrorMessage('Vous ne pouvez pas supprimer un autre administrateur');
      setShowDeleteConfirm(null);
      return;
    }
    
    // Simuler la suppression de l'utilisateur
    setUsers(users.filter(u => u.id !== userId));
    setSuccessMessage('Utilisateur supprimé avec succès');
    setShowDeleteConfirm(null);
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    
    const user = users.find(u => u.id === userId);
    setSuccessMessage(`Utilisateur ${user?.isActive ? 'désactivé' : 'activé'} avec succès`);
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmitUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    if (editingUser.id) {
      // Mise à jour d'un utilisateur existant
      setUsers(users.map(u => 
        u.id === editingUser.id ? editingUser : u
      ));
      setSuccessMessage('Utilisateur mis à jour avec succès');
    } else {
      // Création d'un nouvel utilisateur
      const newUser = {
        ...editingUser,
        id: Date.now().toString(),
        joinedDate: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      setSuccessMessage('Utilisateur créé avec succès');
    }
    
    setShowUserForm(false);
    setEditingUser(null);
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleExportUsers = () => {
    // Simuler l'export des utilisateurs au format CSV
    const headers = ['ID', 'Nom', 'Email', 'Rôle', 'Statut', 'Date d\'inscription', 'Dernière connexion'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(u => [
        u.id,
        u.name,
        u.email,
        u.role,
        u.isActive ? 'Actif' : 'Inactif',
        new Date(u.joinedDate).toLocaleDateString(),
        u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'N/A'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'utilisateurs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSuccessMessage('Liste des utilisateurs exportée avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'instructor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'instructor':
        return 'Formateur';
      default:
        return 'Apprenant';
    }
  };

  if (!user || user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <p className="text-gray-600">Gérez les comptes utilisateurs de la plateforme</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportUsers}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exporter</span>
            </button>
            <button
              onClick={handleCreateUser}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvel Utilisateur</span>
            </button>
          </div>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        )}

        {showUserForm ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingUser?.id ? 'Modifier l\'Utilisateur' : 'Créer un Nouvel Utilisateur'}
              </h2>
              <button
                onClick={() => {
                  setShowUserForm(false);
                  setEditingUser(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUserForm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom Complet *
                  </label>
                  <input
                    type="text"
                    value={editingUser?.name || ''}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editingUser?.email || ''}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    value={editingUser?.role || 'learner'}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.target.value as 'learner' | 'instructor' | 'admin' } : null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="learner">Apprenant</option>
                    <option value="instructor">Formateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={editingUser?.isActive === true}
                        onChange={() => setEditingUser(prev => prev ? { ...prev, isActive: true } : null)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span>Actif</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={editingUser?.isActive === false}
                        onChange={() => setEditingUser(prev => prev ? { ...prev, isActive: false } : null)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span>Inactif</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de l'Avatar
                </label>
                <input
                  type="text"
                  value={editingUser?.avatar || ''}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, avatar: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
                {editingUser?.avatar && (
                  <div className="mt-2">
                    <img
                      src={editingUser.avatar}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserForm(false);
                    setEditingUser(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingUser?.id ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Filtres et Recherche */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                    >
                      <option value="all">Tous les rôles</option>
                      <option value="learner">Apprenants</option>
                      <option value="instructor">Formateurs</option>
                      <option value="admin">Administrateurs</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="active">Actifs</option>
                      <option value="inactive">Inactifs</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                    >
                      <option value="newest">Plus récents</option>
                      <option value="oldest">Plus anciens</option>
                      <option value="name">Nom</option>
                      <option value="email">Email</option>
                      <option value="role">Rôle</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setRoleFilter('all');
                      setStatusFilter('all');
                      setSortBy('newest');
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des Utilisateurs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des utilisateurs...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((userData) => (
                        <tr key={userData.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={userData.avatar}
                                alt={userData.name}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2';
                                }}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                                <div className="text-sm text-gray-500">ID: {userData.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{userData.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(userData.role)}`}>
                              {getRoleLabel(userData.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              userData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {userData.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(userData.joinedDate).toLocaleDateString()}
                            </div>
                            {userData.lastLogin && (
                              <div className="text-xs text-gray-500">
                                Dernière connexion: {new Date(userData.lastLogin).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditUser(userData)}
                                className="text-secondary-600 hover:text-secondary-900 transition-colors"
                                title="Modifier"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(userData.id)}
                                className={`transition-colors ${
                                  userData.isActive 
                                    ? 'text-red-600 hover:text-red-900' 
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                                title={userData.isActive ? 'Désactiver' : 'Activer'}
                              >
                                {userData.isActive ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(userData.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                              <div className="relative group">
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                  <MoreVertical className="h-5 w-5" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                  <button
                                    onClick={() => alert(`Envoi d'un email à ${userData.email}`)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Mail className="h-4 w-4 mr-3" />
                                    Envoyer un email
                                  </button>
                                  <button
                                    onClick={() => alert(`Réinitialisation du mot de passe pour ${userData.name}`)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Shield className="h-4 w-4 mr-3" />
                                    Réinitialiser le mot de passe
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun utilisateur trouvé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                      ? 'Essayez de modifier vos filtres ou votre recherche'
                      : 'Aucun utilisateur n\'est enregistré dans le système'}
                  </p>
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setRoleFilter('all');
                        setStatusFilter('all');
                      }}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateUser}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Créer un utilisateur</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
              <p className="text-gray-700 mb-6">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
              </p>
              <div className="flex items-center space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => showDeleteConfirm && confirmDeleteUser(showDeleteConfirm)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;