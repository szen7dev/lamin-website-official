'use client';

import { useState } from 'react';

import { useHeightMeasurementMutation } from '@/features/height-measurement';
import { useTabContext } from '@/contexts/TabContext';
import { Contact } from '@/features/user/types/userTypes';

interface MeasurementSubmissionProps {
  selectedContact: Contact | null;
  activeTabId: string;
  height: string;
  weight: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

export function useMeasurementSubmission({
  selectedContact,
  activeTabId,
  height,
  weight,
  onSuccess,
  onError,
}: MeasurementSubmissionProps) {
  const { updateTabMeasurement } = useTabContext();
  const [isLoadingGrowTrack, setIsLoadingGrowTrack] = useState(false);

  const {
    mutate: createHeightMeasurement,
    isPending: isCreatingHeightMeasurement,
  } = useHeightMeasurementMutation({
    contactID: selectedContact?._id || '',
    onSuccess: data => {
      console.log('Height measurement created successfully:', data);
    },
  });

  const handleGrowTrack = () => {
    if (!selectedContact) return;

    const payload = {
      name: selectedContact.name,
      birthday: selectedContact.birthday,
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender: selectedContact.gender,
    };

    createHeightMeasurement(payload, {
      onSuccess: async measurementResponse => {
        onSuccess();
        console.log('Height measurement created successfully');

        // Update tab with response immediately and set loading state for grow track
        updateTabMeasurement(activeTabId, {
          response: measurementResponse,
        });

        // Set loading state for grow track data
        setIsLoadingGrowTrack(true);

        // Fetch grow track data for the chart
        if (measurementResponse?._id && activeTabId) {
          try {
            // Import the API function directly to fetch grow track data
            const { getHeightMeasurementInfo } = await import(
              '@/features/height-measurement/api/getHeightMeasurementInfo'
            );
            const growTrackData = await getHeightMeasurementInfo(
              measurementResponse._id,
            );

            updateTabMeasurement(activeTabId, {
              response: measurementResponse,
              growTrack: growTrackData.growTrack,
            });
          } catch (error) {
            console.error('Error fetching grow track data:', error);
            // Still update tab with response data even if grow track fails
            updateTabMeasurement(activeTabId, {
              response: measurementResponse,
            });
          } finally {
            setIsLoadingGrowTrack(false);
          }
        } else {
          setIsLoadingGrowTrack(false);
        }
      },
      onError: error => {
        console.error('Error creating height measurement:', error);
        setIsLoadingGrowTrack(false);
        onError(error);
      },
    });
  };

  return {
    handleGrowTrack,
    isCreatingHeightMeasurement,
    isLoadingGrowTrack,
  };
}
