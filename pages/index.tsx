import { useState, useEffect, JSX } from 'react';
import Head from 'next/head';
import { loadData, saveData, loadExpandedState, saveExpandedState } from '../lib/storage';
import { deleteNodeAtPath, pathToString, serializePath } from '../lib/treeHelpers';
import React from 'react';
import { Upload } from 'lucide-react';



export default function Home() {
   const [data, setData] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>(['root']);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pathToDelete, setPathToDelete] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadedData = loadData();
    const loadedExpanded = loadExpandedState();
    setData(loadedData);
    setExpandedNodes(loadedExpanded);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (data !== null) {
      saveData(data);
    }
  }, [data]);

  // Save expanded state whenever it changes
  useEffect(() => {
    saveExpandedState(expandedNodes);
  }, [expandedNodes]);

  if (data === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>JSON Tree Explorer</title>
        <meta name="description" content="A collapsible JSON tree explorer with import, delete, and persistence capabilities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">JSON Tree Explorer</h1>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm"
              >
                <Upload size={18} />
                Import JSON
              </button>
            </div>
          </div>
        </header>
        </main>
    </>)
}