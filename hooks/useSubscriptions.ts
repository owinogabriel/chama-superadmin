'use client'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Subscription, Chama, Profile } from '@/types/Database'

export type SubscriptionWithChama = Subscription & {
  chamas: Pick<Chama, 'id' | 'name' | 'plan'> & {
    profiles: Pick<Profile, 'full_name' | 'email'> | null
  } | null
}

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          chamas (
            id,
            name,
            plan,
            profiles!chamas_created_by_fkey (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data as SubscriptionWithChama[]
    },
  })
}