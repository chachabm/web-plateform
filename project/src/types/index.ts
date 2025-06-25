export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'learner' | 'instructor' | 'admin';
  joinedDate: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  language: string;
  category: string;
  lessons: number;
  students: number;
  tags: string[];
  isPopular?: boolean;
  isBestseller?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Progress {
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  percentage: number;
  lastAccessed: string;
}