import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SideMenuContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(undefined);

export const SideMenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SideMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SideMenuContext.Provider>
  );
};

export const useSideMenu = () => {
  const context = useContext(SideMenuContext);
  if (context === undefined) {
    throw new Error('useSideMenu must be used within a SideMenuProvider');
  }
  return context;
};