import React from 'react';
import { useState, useEffect } from 'react';

interface ImportModalProps {
  isOpen: boolean;
  onImport: (data: any) => void;
  onCancel: () => void;
}

const SAMPLE_JSON = `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}`;

export default function ImportModal({ isOpen, onImport, onCancel }: ImportModalProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJsonText('');
      setError('');
    }
  }, [isOpen]);

  const handleLoad = () => {
    setError('');
    
    if (!jsonText.trim()) {
      setError('Please enter JSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      onImport(parsed);
      setJsonText('');
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const handleLoadSample = () => {
    setJsonText(SAMPLE_JSON);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Import JSON</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your JSON data below:
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Paste JSON here..."
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleLoadSample}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Load sample JSON
          </button>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Load
          </button>
        </div>
      </div>
    </div>
  );
}
