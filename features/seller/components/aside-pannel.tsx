'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';

import { useMeasurementSubmission } from '../hooks';

import { ContactSearchDropdown } from './contact-search';
import { ContactInformation } from './contact-info';
import { HealthInformationForm } from './health-form';
import { EmptyState } from './empty-state';
import { SubmitButton } from './submit-button';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddContactModal from '@/components/modal/AddContactModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/hooks';
import { useGetContact } from '@/features/user/hooks/useGetContact';
import { cn } from '@/utils';
import { useTabContext } from '@/contexts/TabContext';
import { Contact } from '@/features/user/types/userTypes';

export function AsidePanel() {
  const [isOpenAddContact, setIsOpenAddContact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Form states for height and weight
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { tabs, activeTabId, addTab } = useTabContext();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { user } = useAuth();

  // Only call API when there's a search query
  const shouldFetchContacts = debouncedSearch.trim().length > 0;

  const { contactList, isLoading: isLoadingContacts } = useGetContact({
    userCreateID: user?._id || '',
    keyword: debouncedSearch,
    enabled: shouldFetchContacts,
  });

  // Use the measurement submission hook
  const { handleGrowTrack, isCreatingHeightMeasurement } =
    useMeasurementSubmission({
      selectedContact,
      activeTabId,
      height,
      weight,
      onSuccess: () => {
        setHeight('');
        setWeight('');
      },
      onError: error => {
        console.error('Error in measurement submission:', error);
      },
    });

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    if (activeTab && activeTab.customerData) {
      setSelectedContact(activeTab.customerData);
      setSearchQuery(activeTab.customerName || '');
      setIsDropdownOpen(false);
    } else {
      setSelectedContact(null);
      setSearchQuery('');
    }
  }, [activeTab, activeTabId]);

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    setSearchQuery(contact.name || 'Unnamed Contact');
    setIsDropdownOpen(false);

    addTab(contact._id, contact.name, contact);
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
    if (e.target.value === '') {
      if (!activeTab?.customerData) {
        setSelectedContact(null);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (!activeTab?.customerData) {
      setSelectedContact(null);
    }
    setIsDropdownOpen(false);
  };

  const handleOpenAddContact = () => {
    setIsOpenAddContact(true);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleSubmit = () => {
    // Always call handleGrowTrack since validation is now in SubmitButton
    handleGrowTrack();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <aside className="w-80 border-l bg-muted/20 flex flex-col shrink-0">
      {/* Search Section with Dropdown */}
      <div ref={dropdownRef} className="p-4 border-b shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Input
            className="pl-10 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Nhập để tìm kiếm liên hệ..."
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <Button
              className="h-7 w-7 p-0 bg-blue-600 hover:bg-blue-700"
              size="sm"
              onClick={() => setIsOpenAddContact(true)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Dropdown Results */}
          {isDropdownOpen && (
            <ContactSearchDropdown
              contactList={contactList}
              debouncedSearch={debouncedSearch}
              isLoadingContacts={isLoadingContacts}
              selectedContact={selectedContact}
              onClearSearch={handleClearSearch}
              onCloseDropdown={handleCloseDropdown}
              onContactSelect={handleContactSelect}
              onOpenAddContact={handleOpenAddContact}
            />
          )}
        </div>
      </div>

      {/* Content Area */}
      <div
        className={cn(
          'flex-1 p-4 overflow-auto',
          !selectedContact && 'flex items-center justify-center',
        )}>
        <div className="space-y-4">
          {selectedContact ? (
            <>
              <ContactInformation selectedContact={selectedContact} />
              <HealthInformationForm
                height={height}
                weight={weight}
                onHeightChange={setHeight}
                onWeightChange={setWeight}
              />
            </>
          ) : (
            <EmptyState
              debouncedSearch={debouncedSearch}
              isLoadingContacts={isLoadingContacts}
            />
          )}
        </div>
      </div>

      {/* Submit button - always show when contact is selected */}
      {selectedContact && (
        <SubmitButton
          height={height}
          isCreatingHeightMeasurement={isCreatingHeightMeasurement}
          selectedContact={selectedContact}
          weight={weight}
          onSubmit={handleSubmit}
        />
      )}

      <AddContactModal
        isOpen={isOpenAddContact}
        metadata={{
          source: 'aside-panel',
          initialName: debouncedSearch.trim() || undefined,
          callback: (data: Contact) => {
            setSelectedContact(data);
            setHeight('');
            setWeight('');
            addTab(
              data._id,
              data.name || debouncedSearch.trim() || 'Liên hệ mới',
              data,
            );
          },
        }}
        onClose={() => setIsOpenAddContact(false)}
      />
    </aside>
  );
}
