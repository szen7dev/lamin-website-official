'use client';

import { useEffect, useRef, useState } from 'react';

import { useUpdateContact } from '../hooks/useUpdateContact';

import LocationInfo from './LocationInfo';
import {
  LocationForm,
  LocationFormRef,
  LocationFormSubmission,
} from './LocationForm';

import { useAuth } from '@/hooks';
import { useGetContactByPhone } from '@/features/contact/hooks/useGetContactByPhone';
import { useContact } from '@/contexts/ContactContext';
import { UpdateContactParams } from '@/features/homepage/types/coachTypes';
import { useToast } from '@/hooks/use-toast';

export default function LocationContent() {
  const { updateContact } = useUpdateContact();
  const { user } = useAuth();
  const { toast } = useToast();
  const { setContactInfo } = useContact();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<LocationFormSubmission | null>(
    null,
  );
  const [phoneNumberToLookup, setPhoneNumberToLookup] = useState<string>('');
  const formRef = useRef<LocationFormRef>(null);

  // Contact lookup hook - initialized with empty string, only enabled when we need it
  const { data: contactData, isLoading: isContactLoading } =
    useGetContactByPhone({
      phone: phoneNumberToLookup,
    });

  const handleFormSubmission = (values: LocationFormSubmission) => {
    // Store the form values for future use
    setFormValues(values);

    // If user is not logged in and we have a phone number, try to find the contact first
    if (!user?.id && values.phone) {
      setPhoneNumberToLookup(values.phone);

      // We'll use the useEffect to continue processing after the contactData is available
      return;
    }

    // Otherwise, proceed with submission directly
    processSubmission(values);
  };

  // Effect to handle contact lookup and continue with contact submission
  useEffect(() => {
    // Only proceed if we're looking up a phone number and we have a form submission pending
    if (phoneNumberToLookup && formValues && !isContactLoading) {
      if (contactData) {
        // Contact found, proceed with the submission
        processSubmission(formValues, contactData.contactID);
      } else {
        // No contact found, proceed without a contactID
        processSubmission(formValues);
      }

      // Reset the lookup phone number
      setPhoneNumberToLookup('');
    }
  }, [phoneNumberToLookup, contactData, isContactLoading, formValues]);

  // Modified to accept an optional contactID parameter
  const processSubmission = async (
    formValues: LocationFormSubmission,
    contactID?: string,
  ) => {
    setIsSubmitting(true);
    try {
      const submitData: UpdateContactParams = {
        contactID: contactID || '',
        name: formValues.name || 'Khách hàng',
        phone: formValues.phone || '1234567890',
        email: formValues.email || '',
        // province: formValues.province || 'Hà Nội',
        // district: formValues.district || 'Quận Hoàn Kiếm',
        address: formValues.address || '',
        note: formValues.note || '',
        // areaID:address?: string; formValues.ward || '',
      };

      // // Prioritize user ID if logged in, otherwise use found contact ID
      if (user?.id) {
        submitData.contactID = user.id;
      } else if (contactID) {
        submitData.contactID = contactID;
      }

      // Use the mutation function from useCreateOrder
      await new Promise<void>((resolve, reject) => {
        updateContact(submitData, {
          onSuccess: async response => {
            // Add proper error handling for the response
            const data = response || {};

            setIsSubmitting(false);
            toast({
              title: 'Cập nhật thông tin liên hệ thành công',
              description:
                'Thông tin liên hệ của bạn đã được cập nhật thành công!',
              variant: 'success',
            });

            // Store contact information in context instead of URL parameters
            const contactInfo = {
              contactID: data?._id,
              name: data?.name,
              phone: data?.phone,
              email: data?.email,
              // province: formValues.province || 'Hà Nội',
              // district: formValues.district || 'Quận Hoàn Kiếm',
              address: formValues.address || '',
              note: data?.note || formValues.note,
              // areaID: data?.areaID || formValues.ward,
            };

            // Set the contact info in context
            setContactInfo(contactInfo);
            resolve();
          },
          onError: error => {
            setIsSubmitting(false);
            toast({
              title: 'Cập nhật thất bại',
              description:
                error.message ||
                'Đã xảy ra lỗi khi cập nhật thông tin liên hệ.',
              variant: 'destructive',
            });
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error('Error submitting contact:', error);
      toast({
        title: 'Cập nhật thất bại',
        description:
          'Đã xảy ra lỗi khi cập nhật thông tin liên hệ. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  // Function to trigger form submission from CartSummary
  const handleCheckoutClick = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <div>
      <div className="mx-auto">
        <LocationInfo />

        <div className="bg-white p-4 rounded-t-xl mb-1">
          <LocationForm
            ref={formRef}
            isSubmitting={isSubmitting}
            onSubmit={handleFormSubmission}
          />

          <div className="flex justify-end items-center mt-4">
            <button
              className=" bg-[#0052A4] text-white py-2 px-12 rounded-full hover:bg-[#0052A4]/90 transition"
              onClick={handleCheckoutClick}>
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
