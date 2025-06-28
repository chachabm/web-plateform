import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VideoSessionProvider } from './contexts/VideoSessionContext';
import AuthGuard from './components/Layout/AuthGuard';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseEdit from './pages/AdminCourseEdit';
import AdminLessonManager from './pages/AdminLessonManager';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminCourseCreate from './pages/AdminCourseCreate';
import AdminLessonCreate from './pages/AdminLessonCreate';
import VideoSessionManager from './pages/VideoSessionManager';
import TeacherCourseManagement from './pages/TeacherCourseManagement';
import VideoSessionDetail from './pages/VideoSessionDetail';
import QuizCreator from './pages/QuizCreator';
import QuizManager from './pages/QuizManager';
import Certificate from './pages/Certificate';
import UserSubscription from './pages/UserSubscription';


function App() {
  return (
    <AuthProvider>
      <VideoSessionProvider>
        <Router>
          <AuthGuard>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  {/* Routes Publiques - Aucune Authentification Requise */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route 
                    path="/login" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Login />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Register />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Routes Protégées - Authentification Requise */}
                  <Route 
                    path="/courses" 
                    element={
                      <ProtectedRoute>
                        <Courses />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/course/:id" 
                    element={
                      <ProtectedRoute>
                        <CourseDetail />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/course/:id/learn" 
                    element={
                      <ProtectedRoute>
                        <CoursePlayer />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/course/:id/quiz" 
                    element={
                      <ProtectedRoute>
                        <Quiz />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/messages" 
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    } 
                  />

                    <Route 
                    path="/certificate/:id" 
                    element={
                      <ProtectedRoute>
                        <Certificate />
                      </ProtectedRoute>
                    } 
                  />
                    <Route 
                    path="/my-subscription" 
                    element={
                      <ProtectedRoute>
                        <UserSubscription />
                      </ProtectedRoute>
                    } 
                  />
                
                  {/* Routes Instructeur - Authentification Requise */}
                  <Route 
                    path="/video-sessions" 
                    element={
                      <ProtectedRoute roles={['instructor', 'admin']}>
                        <VideoSessionManager />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/video-sessions/:id" 
                    element={
                      <ProtectedRoute>
                        <VideoSessionDetail />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teacher/courses" 
                    element={
                      <ProtectedRoute roles={['instructor', 'admin']}>
                        <TeacherCourseManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/quizzes" 
                    element={
                      <ProtectedRoute roles={['instructor', 'admin']}>
                        <QuizManager />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/quizzes/new" 
                    element={
                      <ProtectedRoute roles={['instructor', 'admin']}>
                        <QuizCreator />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/quizzes/:id/edit" 
                    element={
                      <ProtectedRoute roles={['instructor', 'admin']}>
                        <QuizCreator />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/courses/:courseId/quiz/new" 
                    element={
                      <ProtectedRoute roles={['instructor', 'admin']}>
                        <QuizCreator />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Routes Admin - Authentification Requise */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/courses/new" 
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminCourseCreate />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/lessons/new" 
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminLessonCreate />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/courses/:id/edit" 
                    element={
                      <ProtectedRoute roles={['admin', 'instructor']}>
                        <AdminCourseEdit />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/courses/:courseId/lessons" 
                    element={
                      <ProtectedRoute roles={['admin', 'instructor']}>
                        <AdminLessonManager />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <AdminUserManagement />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Route de secours */}
                  <Route 
                    path="*" 
                    element={
                      <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                          <p className="text-gray-600 mb-6">Page non trouvée</p>
                          <a 
                            href="/" 
                            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Retour à l'Accueil
                          </a>
                        </div>
                      </div>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthGuard>
        </Router>
      </VideoSessionProvider>
    </AuthProvider>
  );
}

export default App;