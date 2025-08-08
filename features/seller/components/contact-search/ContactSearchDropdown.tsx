'use client';

import { Plus, Search, User, Mail, Phone, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { genderOptions, getGenderColor, getInitials } from '@/utils';
import { Contact } from '@/features/user/types/userTypes';

interface ContactSearchDropdownProps {
  debouncedSearch: string;
  isLoadingContacts: boolean;
  contactList?: Contact[];
  selectedContact: Contact | null;
  onContactSelect: (contact: Contact) => void;
  onClearSearch: () => void;
  onOpenAddContact: () => void;
  onCloseDropdown: () => void;
}

export function ContactSearchDropdown({
  debouncedSearch,
  isLoadingContacts,
  contactList,
  selectedContact,
  onContactSelect,
  onClearSearch,
  onOpenAddContact,
  onCloseDropdown,
}: ContactSearchDropdownProps) {
  const renderDropdownContent = () => {
    if (!debouncedSearch.trim()) {
      return (
        <div className="px-3 py-8 text-center">
          <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Bắt đầu tìm kiếm</p>
          <p className="text-xs text-gray-500 mb-3">
            Nhập tên, email hoặc số điện thoại để tìm kiếm liên hệ
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onOpenAddContact();
              onCloseDropdown();
            }}>
            <Plus className="h-3 w-3 mr-1" />
            Thêm liên hệ mới
          </Button>
        </div>
      );
    }

    if (isLoadingContacts) {
      return (
        <div className="p-2 space-y-1">
          <div className="text-center py-2">
            <p className="text-xs text-gray-500">
              Đang tìm kiếm &quot;{debouncedSearch}&quot;...
            </p>
          </div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Case 3: User searched and has results
    if (contactList && contactList.length > 0) {
      return (
        <div className="py-1">
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-600">
              Tìm thấy{' '}
              <span className="font-medium text-blue-600">
                {contactList.length}
              </span>{' '}
              kết quả cho &quot;{debouncedSearch}&quot;
            </p>
          </div>
          {contactList.map((contact, index) => (
            <div
              key={contact._id || index}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
              role="button"
              tabIndex={0}
              onClick={() => onContactSelect(contact)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onContactSelect(contact);
                }
              }}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={contact.image} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-medium">
                  {getInitials(contact.name || 'N/A')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 text-sm truncate">
                    {contact.name || 'Không có tên'}
                  </h4>
                  {contact.gender && (
                    <Badge
                      className={`text-xs px-1.5 py-0.5 ${getGenderColor(contact.gender)}`}
                      variant="secondary">
                      {contact?.gender
                        ? genderOptions[
                            contact.gender as keyof typeof genderOptions
                          ]
                        : 'Khác'}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {contact.email && (
                    <div className="flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedContact?._id === contact._id && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="px-3 py-8 text-center">
        <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">Không tìm thấy kết quả</p>
        <p className="text-xs text-gray-500 mb-3">
          Không có liên hệ nào phù hợp với &quot;{debouncedSearch}&quot;
        </p>
        <div className="space-y-2">
          <Button size="sm" variant="outline" onClick={onClearSearch}>
            Xóa tìm kiếm
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              onOpenAddContact();
              onCloseDropdown();
            }}>
            <Plus className="h-3 w-3 mr-1" />
            Thêm liên hệ &quot;{debouncedSearch}&quot;
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
      {renderDropdownContent()}
    </div>
  );
}
