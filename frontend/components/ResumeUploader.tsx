'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResumeUploaderProps {
  onUpload: (file: File, title: string, isDefault: boolean) => Promise<void>;
  isUploading?: boolean;
}

export default function ResumeUploader({ onUpload, isUploading = false }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (file.type !== 'application/pdf') {
      return 'Le fichier doit être au format PDF';
    }

    // Check file size (10 MB max)
    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      return 'Le fichier ne doit pas dépasser 10 Mo';
    }

    return null;
  };

  const handleFile = useCallback((selectedFile: File) => {
    setError('');
    
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    
    // Generate title from filename if not provided
    if (!title) {
      const nameWithoutExt = selectedFile.name.replace(/\.pdf$/i, '');
      setTitle(nameWithoutExt);
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, [title]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError('Veuillez sélectionner un fichier et donner un titre');
      return;
    }

    await onUpload(file, title.trim(), isDefault);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Area */}
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center transition-colors
            ${dragActive 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-full mb-4 ${
              dragActive ? 'bg-primary-100' : 'bg-gray-100'
            }`}>
              <Upload className={`h-8 w-8 ${
                dragActive ? 'text-primary-600' : 'text-gray-400'
              }`} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Glissez-déposez votre CV ici
            </h3>
            <p className="text-gray-600 mb-4">
              ou cliquez pour sélectionner un fichier
            </p>
            <p className="text-sm text-gray-500">
              Format PDF uniquement • Taille max : 10 Mo
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* File Info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start flex-1">
              <div className="p-3 bg-primary-50 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {file.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)} • PDF
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              disabled={isUploading}
              className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Preview */}
          {preview && (
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={preview}
                className="w-full h-96"
                title="CV Preview"
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre du CV *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Ex: CV Développeur Python"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isUploading}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={isUploading}
              />
              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                Définir comme CV par défaut
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isUploading || !title.trim()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Télécharger le CV
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

