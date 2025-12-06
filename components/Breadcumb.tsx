import React from "react";

interface BreadcrumbProps {
  path: string[];
  onSegmentClick?: (segmentPath: string[]) => void;
}

export default function Breadcrumb({ path, onSegmentClick }: BreadcrumbProps) {
  if (path.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap mb-4 pb-3 border-b border-gray-200">
      {path.map((segment, index) => {
        const segmentPath = path.slice(0, index + 1);
        const isLast = index === path.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {onSegmentClick ? (
              <button
                onClick={() => onSegmentClick(segmentPath)}
                className={`hover:text-blue-600 transition-colors ${
                  isLast ? 'font-semibold text-gray-900' : 'text-gray-600'
                }`}
              >
                {segment}
              </button>
            ) : (
              <span className={isLast ? 'font-semibold text-gray-900' : ''}>
                {segment}
              </span>
            )}
            {!isLast && <span className="text-gray-400">&gt;</span>}
          </div>
        );
      })}
    </div>
  );
}
