"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface WorkspaceContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFolder: string;
  setActiveFolder: (folder: string) => void;
  activeTag: string;
  setActiveTag: (tag: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");
  const [activeTag, setActiveTag] = useState("");

  return (
    <WorkspaceContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      activeFolder, 
      setActiveFolder,
      activeTag,
      setActiveTag
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
