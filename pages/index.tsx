import { useState, useEffect, JSX } from 'react';
import Head from 'next/head';
import { loadData, saveData, loadExpandedState, saveExpandedState } from '../lib/storage';
import React from 'react';


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
}