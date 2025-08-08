'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Tab {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  customerData?: any;
  measurementData?: {
    response?: any;
    growTrack?: any;
  };
}

interface TabContextType {
  tabs: Tab[];
  activeTabId: string;
  addTab: (
    customerId: string,
    customerName: string,
    customerData?: any,
  ) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabMeasurement: (
    tabId: string,
    measurementData: { response?: any; growTrack?: any },
  ) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'Customer 1',
      customerId: '1',
      customerName: 'Customer 1',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');

  const addTab = (
    customerId: string,
    customerName: string,
    customerData?: any,
  ) => {
    // Check if tab already exists
    const existingTab = tabs.find(tab => tab.customerId === customerId);

    if (existingTab) {
      // Switch to existing tab
      setActiveTabId(existingTab.id);

      return;
    }

    // Create new tab
    const newTabId = Date.now().toString();
    const newTab: Tab = {
      id: newTabId,
      title: customerName,
      customerId,
      customerName,
      customerData,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const removeTab = (tabId: string) => {
    if (tabs.length === 1) return;

    const newTabs = tabs.filter(tab => tab.id !== tabId);

    setTabs(newTabs);

    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0]?.id || '');
    }
  };

  const setActiveTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const updateTabMeasurement = (
    tabId: string,
    measurementData: { response?: any; growTrack?: any },
  ) => {
    setTabs(prev =>
      prev.map(tab => (tab.id === tabId ? { ...tab, measurementData } : tab)),
    );
  };

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        removeTab,
        setActiveTab,
        updateTabMeasurement,
      }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);

  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }

  return context;
};
