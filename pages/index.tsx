import { useState, useEffect, JSX } from 'react';
import Head from 'next/head';
import { loadData, saveData, loadExpandedState, saveExpandedState } from '../lib/storage';
import { deleteNodeAtPath, pathToString, serializePath } from '../lib/treeHelpers';
import React from 'react';
import { Upload } from 'lucide-react';
import TreeExplorer from '../components/TreeExplorer';
import Breadcrumb from '../components/Breadcumb';
import ImportModal from '../components/ImportModal';
import ConfirmModal from '../components/ConfirmModal';




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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

   const handleToggle = (path: string[]) => {
    const pathStr = serializePath(path);
    const newExpanded = new Set(expandedNodes);
    
    if (newExpanded.has(pathStr)) {
      newExpanded.delete(pathStr);
    } else {
      newExpanded.add(pathStr);
    }
    
    setExpandedNodes(newExpanded);
  };

  const handleSelect = (path: string[]) => {
    setSelectedPath(path);
  };

  const handleDeleteRequest = (path: string[]) => {
    if (path.length <= 1) {
      // Cannot delete root
      return;
    }
    setPathToDelete(path);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (pathToDelete.length > 1) {
      const newData = deleteNodeAtPath(data, pathToDelete);
      setData(newData);
      
      // If deleted node was selected, select root
      if (serializePath(selectedPath) === serializePath(pathToDelete)) {
        setSelectedPath(['root']);
      }
    }
    setIsConfirmModalOpen(false);
    setPathToDelete([]);
  };

  const handleDeleteCancel = () => {
    setIsConfirmModalOpen(false);
    setPathToDelete([]);
  };

  const handleImport = (importedData: any) => {
    setData(importedData);
    setSelectedPath(['root']);
    setExpandedNodes(new Set(['root']));
    setIsImportModalOpen(false);
  };

  const handleBreadcrumbClick = (segmentPath: string[]) => {
    setSelectedPath(segmentPath);
  };


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
         {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-140px)]">
            {/* Left: Tree Explorer */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700">Explorer</h2>
              </div>
              <div className="flex-1 overflow-auto">
                <TreeExplorer
                  data={data}
                  selectedPath={selectedPath}
                  expandedNodes={expandedNodes}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                  onDelete={handleDeleteRequest}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Right: JSON Viewport */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700">JSON Viewer</h2>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <Breadcrumb path={selectedPath} onSegmentClick={handleBreadcrumbClick} />
                <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
                  <pre className="text-sm text-green-400 font-mono">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
      {/* Modals */}
        <ImportModal
          isOpen={isImportModalOpen}
          onImport={handleImport}
          onCancel={() => setIsImportModalOpen(false)}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          title="Confirm Delete"
          message={`Are you sure you want to delete this node?\n\nPath: ${pathToString(pathToDelete)}`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </main>
    </>
  );
}