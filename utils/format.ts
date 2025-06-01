export const formatCurrency = (amount: number, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatPhoneNumber = (phoneNumber: string) => {
  // Format Vietnamese phone number
  return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
};

export const formatPrice = (price: number | undefined) => {
  if (price === undefined) return '0đ';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('vi-VN').format(number);
};

export const formattedDeliveryDate = (
  deliveryStartETA: string,
  deliveryEndETA: string,
) => {
  // Get next day for delivery estimate
  const deliveryStartTime = new Date(deliveryStartETA || new Date());
  const deliveryEndTime = new Date(deliveryEndETA || new Date());

  // Format the delivery date (for deliveryStartETA just get time itme (like: 08:00) and for deliveryEndETA get time and date (like: 08:00 - 18:00, 01/01/2022))
  let formattedDeliveryDate;

  if (
    deliveryStartTime.getDate() !== deliveryEndTime.getDate() ||
    deliveryStartTime.getMonth() !== deliveryEndTime.getMonth() ||
    deliveryStartTime.getFullYear() !== deliveryEndTime.getFullYear()
  ) {
    formattedDeliveryDate = `${deliveryStartTime.getHours()}:00, ${deliveryStartTime.getDate()}/${deliveryStartTime.getMonth()}/${deliveryStartTime.getFullYear()} - ${deliveryEndTime.getHours()}:00, ${deliveryEndTime.getDate()}/${deliveryEndTime.getMonth()}/${deliveryEndTime.getFullYear()}`;
  } else {
    formattedDeliveryDate = `${deliveryStartTime.getHours()}:00 - ${deliveryEndTime.getHours()}:00, ${deliveryEndTime.getDate()}/${deliveryEndTime.getMonth()}/${deliveryEndTime.getFullYear()}`;
  }

  return formattedDeliveryDate;
};

export function normalizeResponse<T = any>(response: any): T {
  if (!response) return response;

  if (Array.isArray(response)) {
    return response as unknown as T;
  }

  if (typeof response === 'object') {
    if (response.data !== undefined) {
      if (!response.error || response.status === 200) {
        if (response.data.listRecords !== undefined) {
          return response.data.listRecords as unknown as T;
        }

        if (
          response.data.data &&
          response.data.data.listRecords !== undefined
        ) {
          return response.data.data.listRecords as unknown as T;
        }

        return response.data as unknown as T;
      }
      throw {
        message: response.message || 'Server error',
        status: response.status,
        data: response.data,
      };
    }

    if (response.listRecords !== undefined) {
      return response.listRecords as unknown as T;
    }
  }

  return response as unknown as T;
}
