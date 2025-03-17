"use client"

import { useQuery } from "@tanstack/react-query"
import { configService } from "@/services/item/configService"

export function useContactInfo() {
  return useQuery({
    queryKey: ["contactInfo"],
    queryFn: () => configService.getContactInfo(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

