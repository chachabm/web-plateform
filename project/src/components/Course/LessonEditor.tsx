import React, { useState, useRef } from 'react';
import { Save, X, Upload, Trash2, Plus, Video, FileText, Clock } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'other';
  url: string;
  size: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  resources: Resource[];
  isPreview: boolean;
  isPublished: boolean;
}

interface LessonEditorProps {
  lesson: Lesson;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Lesson>(lesson);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Dans une application réelle, vous téléchargeriez le fichier et obtiendriez une URL
      // Pour cette démo, nous utilisons simplement un URL d'objet local
      setFormData({
        ...formData,
        videoUrl: URL.createObjectURL(file),
        duration: estimateVideoDuration(file.size)
      });
    }
  };

  const estimateVideoDuration = (fileSize: number): string => {
    // Estimation très approximative basée sur la taille du fichier
    // Supposons qu'un fichier de 10 Mo dure environ 1 minute
    const estimatedMinutes = Math.round(fileSize / (10 * 1024 * 1024));
    return `${Math.max(1, estimatedMinutes)}:00`;
  };

  const handleResourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = getFileType(file.name);
      const newResource: Resource = {
        id: Date.now().toString(),
        name: file.name,
        type: fileType,
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size)
      };

      setFormData({
        ...formData,
        resources: [...formData.resources, newResource]
      });
    }
  };

  const getFileType = (fileName: string): Resource['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'doc';
    if (['mp4', 'webm', 'avi', 'mov'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(extension || '')) return 'audio';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const removeResource = (resourceId: string) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter(resource => resource.id !== resourceId)
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {lesson.id ? 'Modifier la Leçon' : 'Créer une Nouvelle Leçon'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre de la Leçon *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
            placeholder="Ex: Introduction à la Grammaire Espagnole"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Décrivez le contenu de cette leçon..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vidéo de la Leçon
          </label>
          <div className="space-y-3">
            {formData.videoUrl && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Video className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">Vidéo téléchargée</p>
                      <p className="text-sm text-gray-500">Durée estimée: {formData.duration}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, videoUrl: '' })}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoUpload}
                accept="video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Télécharger une Vidéo</span>
              </button>
              <span className="text-sm text-gray-500">ou</span>
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="URL de la vidéo (YouTube, Vimeo, etc.)"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée
          </label>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: 10:30"
            />
            <span className="text-sm text-gray-500">Format: minutes:secondes</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ressources
            </label>
            <input
              type="file"
              ref={resourceInputRef}
              onChange={handleResourceUpload}
              className="hidden"
              multiple
            />
            <button
              type="button"
              onClick={() => resourceInputRef.current?.click()}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter une Ressource</span>
            </button>
          </div>

          {formData.resources.length > 0 ? (
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              {formData.resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{resource.name}</p>
                      <p className="text-xs text-gray-500">{resource.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResource(resource.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">Aucune ressource ajoutée</p>
              <button
                type="button"
                onClick={() => resourceInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Télécharger des fichiers
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPreview}
              onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Leçon de Prévisualisation</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Publier la Leçon</span>
          </label>
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Enregistrer la Leçon</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonEditor;