import { useEffect, useRef } from 'react';
import TreeNode from './TreeNode';
import { serializePath } from '../lib/treeHelpers';
import React from 'react';

interface TreeExplorerProps {
  data: any;
  selectedPath: string[];
  expandedNodes: Set<string>;
  onToggle: (path: string[]) => void;
  onSelect: (path: string[]) => void;
  onDelete: (path: string[]) => void;
}

export default function TreeExplorer({
  data,
  selectedPath,
  expandedNodes,
  onToggle,
  onSelect,
  onDelete,
}: TreeExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-expand parent nodes of selected path
  useEffect(() => {
    if (selectedPath.length > 1) {
      for (let i = 1; i < selectedPath.length; i++) {
        const parentPath = selectedPath.slice(0, i + 1);
        const pathStr = serializePath(parentPath);
        if (!expandedNodes.has(pathStr)) {
          onToggle(parentPath);
        }
      }
    }
  }, [selectedPath]);

  const isNodeExpanded = (path: string[]): boolean => {
    return expandedNodes.has(serializePath(path));
  };

  const isNodeSelected = (path: string[]): boolean => {
    return serializePath(path) === serializePath(selectedPath);
  };

  return (
    <div ref={containerRef} className="h-full overflow-auto">
      <TreeNode
        keyName="root"
        value={data}
        path={['root']}
        depth={0}
        isExpanded={isNodeExpanded(['root'])}
        isSelected={isNodeSelected(['root'])}
        onToggle={onToggle}
        onSelect={onSelect}
        onDelete={onDelete}
        isRoot={true}
      />
    </div>
  );
}
