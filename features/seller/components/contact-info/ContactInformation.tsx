'use client';

import { User, Mail, Phone, UserCheck, Search } from 'lucide-react';

import { Contact } from '@/features/user/types/userTypes';

interface ContactInformationProps {
  selectedContact: Contact;
}

export function ContactInformation({
  selectedContact,
}: ContactInformationProps) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <User className="h-4 w-4" />
        Thông tin cơ bản
      </h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>Họ tên:</span>
          </div>
          <span className="text-sm font-medium text-gray-900 text-right">
            {selectedContact.name || 'Chưa cập nhật'}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <span>Email:</span>
          </div>
          <span className="text-sm font-medium text-gray-900 text-right truncate max-w-36">
            {selectedContact.email || 'Chưa cập nhật'}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Phone className="h-4 w-4" />
            <span>Số điện thoại:</span>
          </div>
          <span className="text-sm font-medium text-gray-900 text-right">
            {selectedContact.phone || 'Chưa cập nhật'}
          </span>
        </div>

        {selectedContact.birthday && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <UserCheck className="h-4 w-4" />
              <span>Ngày sinh:</span>
            </div>
            <span className="text-sm font-medium text-gray-900 text-right">
              {new Date(selectedContact.birthday).toLocaleDateString('vi-VN')}
            </span>
          </div>
        )}

        {selectedContact.address && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="h-4 w-4" />
              <span>Địa chỉ:</span>
            </div>
            <span className="text-sm font-medium text-gray-900 text-right truncate max-w-32">
              {selectedContact.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
