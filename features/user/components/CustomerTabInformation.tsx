'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { formatDate } from 'date-fns';
import Link from 'next/link';

import { useGetContact } from '../hooks/useGetContact';

import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddContactModal from '@/components/modal/AddContactModal';
import { DisplayContact } from '@/features/user/types/userTypes';

interface CustomerTabInformationProps {
  tabInfo: {
    name: string;
    type: 'customer' | 'height';
  };
}

export function CustomerTabInformation({
  tabInfo,
}: CustomerTabInformationProps) {
  const [openModal, setOpenModal] = useState(false);
  const [displayedContacts, setDisplayedContacts] = useState<DisplayContact[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();
  const { contactList, refetch } = useGetContact({
    userCreateID: user?._id || '',
    keyword: searchQuery,
  });

  useEffect(() => {
    refetch();
    if (contactList) {
      const transformedContacts: DisplayContact[] = contactList.map(
        (contact: any) => ({
          _id: contact._id,
          name: contact.name || 'N/A',
          birthday: contact.birthday || '',
          phone: contact.phone || 'N/A',
          gender:
            contact.gender === 0 ? 'Nam' : contact.gender === 1 ? 'Nữ' : 'Khác',
          email: contact.email || '',
          childs: [],
        }),
      );

      setDisplayedContacts(transformedContacts);
    }
  }, [contactList]);

  return (
    <>
      {tabInfo.type === 'customer' && (
        <>
          <div className="flex flex-col gap-4 border border-gray-200 p-6 bg-white rounded-2xl">
            <h2 className="text-lg font-semibold">{tabInfo.name}</h2>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between gap-5 mb-6">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>

                  <Input
                    className="pl-10 py-3 border border-gray-300 rounded-md"
                    placeholder="Họ và tên, Số điện thoại..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  className=" bg-primary hover:bg-primary/80 text-white rounded-r-md"
                  onClick={() => refetch()}>
                  Tìm kiếm
                </Button>
              </div>

              <div className="space-y-6">
                {displayedContacts.map(customer => (
                  <Link
                    key={customer._id}
                    className="decoration-transparent"
                    href={`/account/for-seller/${customer._id}`}>
                    <div
                      className="border-b border-gray-200 pb-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-md p-2"
                      role="button"
                      tabIndex={0}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600">👤</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {customer.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 ml-10">
                        <div>
                          Ngày sinh:{' '}
                          {customer?.birthday && customer.birthday !== 'N/A'
                            ? formatDate(
                                new Date(customer.birthday),
                                'dd/MM/yyyy',
                              )
                            : 'N/A'}{' '}
                          |
                        </div>
                        <div>Số điện thoại: {customer.phone} |</div>
                        <div>Giới tính: {customer.gender} |</div>
                        <div>Email: {customer.email}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="bg-[#E6F8FF] hover:bg-[#E6F8FF]/80 text-primary px-6 py-2 rounded-lg border border-primary hover:border-primary/80"
                onClick={() => setOpenModal(true)}>
                Tạo liên hệ mới
              </Button>
            </div>
          </div>
        </>
      )}

      <AddContactModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
