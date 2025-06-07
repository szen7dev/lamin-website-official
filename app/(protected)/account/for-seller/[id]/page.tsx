'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CustomerDetailView } from '@/features/user/components/CustomerDetailView';
import { useGetContact } from '@/features/user/hooks/useGetContact';
import { DisplayContact } from '@/features/user/types/userTypes';
import { useAuth } from '@/hooks';
import { useGetContactDetail } from '@/features/user/hooks/useGetContactDetail';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  const [customer, setCustomer] = useState<DisplayContact | null>(null);
  const [childContacts, setChildContacts] = useState<DisplayContact[]>([]);
  const { user } = useAuth();

  const handleContactUpdated = () => {
    refetchChildren();
  };

  const { contactList: childrenList, refetch: refetchChildren } = useGetContact(
    {
      userCreateID: user?._id || '',
      parentID: customerId,
      optionSeller: 1,
    },
  );

  const { contactDetail: singleContact } = useGetContactDetail({
    contactID: customerId,
  });

  useEffect(() => {
    if (singleContact) {
      const transformedContact: DisplayContact = {
        _id: singleContact._id,
        name: singleContact.name || 'N/A',
        birthday: singleContact.birthday || '',
        phone: singleContact.phone || 'N/A',
        gender:
          singleContact.gender === 0
            ? 'Nam'
            : singleContact.gender === 1
              ? 'Nữ'
              : 'Khác',
        email: singleContact.email || '',
        childs: [],
      };

      setCustomer(transformedContact);
    }
  }, [customerId, singleContact]);

  useEffect(() => {
    if (childrenList) {
      const transformedChildren: DisplayContact[] = childrenList.map(
        contact => ({
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

      setChildContacts(transformedChildren);
    }
  }, [childrenList]);

  useEffect(() => {
    refetchChildren();
  }, [customerId, refetchChildren]);

  const handleBack = () => {
    router.push('/account/for-seller');
  };

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <CustomerDetailView
        childContacts={childContacts}
        customer={customer}
        onBack={handleBack}
        onContactUpdated={handleContactUpdated}
      />
    </div>
  );
}
