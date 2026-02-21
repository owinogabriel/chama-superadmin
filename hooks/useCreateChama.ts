'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateChamaPayload {
  chamaName: string
  description: string
  adminName: string
  adminEmail: string
  adminPhone: string
  contributionAmount: string
  contributionFrequency: string
  meetingDay: string
  plan: string
}

interface CreateChamaResponse {
  success: boolean
  chamaId: string
  tempPassword: string
}

const createChama = async (payload: CreateChamaPayload): Promise<CreateChamaResponse> => {
  const res = await fetch('/api/create-chama', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create chama')
  }

  return data
}

export const useCreateChama = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateChamaResponse, Error, CreateChamaPayload>({
    mutationFn: createChama,
    onSuccess: () => {
      // invalidate chamas list so it refetches
      queryClient.invalidateQueries({ queryKey: ['chamas'] })
    },
  })
}