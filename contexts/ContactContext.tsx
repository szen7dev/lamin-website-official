'use client';

import type React from 'react';

import { createContext, useContext, useState } from 'react';

/**
 * Type definition for order information that needs to be shared between pages
 */
export interface ContactInfo {
  contactID: string;
  name: string;
  phone: string;
  email: string;
  // province: string;
  // district: string;
  address: string;
  note: string | undefined;
  // areaID: string;
}

type ContactContextType = {
  contactInfo: ContactInfo | null;
  setContactInfo: (contactInfo: ContactInfo) => void;
  clearContactInfo: () => void;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

/**
 * Provider component for the OrderContext
 */
export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [contactInfo, setContactInfoState] = useState<ContactInfo | null>(null);

  // Set order information
  const setContactInfo = (info: ContactInfo) => {
    setContactInfoState(info);

    // Optionally store in localStorage for persistence across page refreshes
    try {
      localStorage.setItem('contactInfo', JSON.stringify(info));
    } catch (error) {
      console.error('Failed to save contact info to localStorage:', error);
    }
  };

  // Clear order information
  const clearContactInfo = () => {
    setContactInfoState(null);
    try {
      localStorage.removeItem('contactInfo');
    } catch (error) {
      console.error('Failed to remove contact info from localStorage:', error);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        contactInfo,
        setContactInfo,
        clearContactInfo,
      }}>
      {children}
    </ContactContext.Provider>
  );
}

/**
 * Hook to use the OrderContext
 */
export function useContact() {
  const context = useContext(ContactContext);

  if (context === undefined) {
    throw new Error('useContact must be used within an ContactContext');
  }

  return context;
}
