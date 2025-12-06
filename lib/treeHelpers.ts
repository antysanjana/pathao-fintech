export function deleteNodeAtPath(data: any, path: string[]): any {
  if (path.length === 0 || path.length === 1) {
    // Cannot delete root
    return data;
  }

  // Clone the entire data structure
  const clone = JSON.parse(JSON.stringify(data));

  // Navigate to parent
  let current = clone;
  for (let i = 1; i < path.length - 1; i++) {
    current = current[path[i]];
  }

  const lastKey = path[path.length - 1];

  if (Array.isArray(current)) {
    const index = parseInt(lastKey, 10);
    current.splice(index, 1);
  } else {
    delete current[lastKey];
  }

  return clone;
}

export function getNodeAtPath(data: any, path: string[]): any {
  let current = data;

  for (let i = 1; i < path.length; i++) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[path[i]];
  }

  return current;
}

export function pathToString(path: string[]): string {
  return path.join(' > ');
}

export function isValidPath(data: any, path: string[]): boolean {
  try {
    const value = getNodeAtPath(data, path);
    return value !== undefined;
  } catch {
    return false;
  }
}

export function serializePath(path: string[]): string {
  return path.join('.');
}

export function hasChildren(value: any): boolean {
  if (value === null || value === undefined) return false;

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return false;
}

export function getChildKeys(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map((_, index) => String(index));
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value);
  }

  return [];
}
