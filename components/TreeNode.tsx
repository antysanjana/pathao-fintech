import { hasChildren, getChildKeys, serializePath } from '../lib/treeHelpers';
import { Trash2, ChevronRight } from 'lucide-react';
import React from 'react';

interface TreeNodeProps {
  keyName: string;
  value: any;
  path: string[];
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (path: string[]) => void;
  onSelect: (path: string[]) => void;
  onDelete: (path: string[]) => void;
  isRoot?: boolean;
}

export default function TreeNode({
  keyName,
  value,
  path,
  depth,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  onDelete,
  isRoot = false,
}: TreeNodeProps) {
  const hasChild = hasChildren(value);
  const childKeys = hasChild ? getChildKeys(value) : [];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChild) {
      onToggle(path);
    }
  };

  const handleSelect = () => {
    onSelect(path);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(path);
  };

  const getValuePreview = (val: any): string => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'boolean') return val.toString();
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'string') return `"${val}"`;
    if (Array.isArray(val)) return `Array(${val.length})`;
    if (typeof val === 'object') return `Object(${Object.keys(val).length})`;
    return '';
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-100 transition-colors group ${
          isSelected ? 'bg-blue-100 hover:bg-blue-200' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleSelect}
      >
        {/* Caret/Arrow */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-4 h-4 flex items-center justify-center transition-transform ${
            hasChild ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${isExpanded ? 'rotate-90' : ''}`}
        >
          <ChevronRight size={14} />
        </button>

        {/* Key name */}
        <span className="font-medium text-gray-800 text-sm">
          {keyName}
          {!hasChild && <span className="text-gray-500">: {getValuePreview(value)}</span>}
        </span>

        {/* Delete button */}
        {!isRoot && (
          <button
            onClick={handleDelete}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
            title="Delete node"
          >
            <Trash2 size={14} className="text-red-600" />
          </button>
        )}
      </div>

      {/* Children */}
      {hasChild && isExpanded && (
        <div>
          {childKeys.map((childKey) => {
            const childPath = [...path, childKey];
            const childValue = Array.isArray(value) ? value[parseInt(childKey)] : value[childKey];
            const childPathStr = serializePath(childPath);

            return (
              <TreeNode
                key={childPathStr}
                keyName={childKey}
                value={childValue}
                path={childPath}
                depth={depth + 1}
                isExpanded={isExpanded}
                isSelected={isSelected}
                onToggle={onToggle}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
