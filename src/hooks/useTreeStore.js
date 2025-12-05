import { createContext, useContext, useState, useEffect } from "react";

const TreeContext = createContext();

export function TreeProvider({ children }) {
  const [treeData, setTreeData] = useState({});
  const [selectedPath, setSelectedPath] = useState([]);

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("tree-data");
    if (saved) {
      setTreeData(JSON.parse(saved));
    }
  }, []);

  // Persist on every update
  useEffect(() => {
    localStorage.setItem("tree-data", JSON.stringify(treeData));
  }, [treeData]);

  return (
    <TreeContext.Provider
      value={{
        treeData,
        setTreeData,
        selectedPath,
        setSelectedPath,
      }}
    >
      {children}
    </TreeContext.Provider>
  );
}

export function useTreeStore() {
  return useContext(TreeContext);
}
