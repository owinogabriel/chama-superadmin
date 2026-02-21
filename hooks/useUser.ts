'use client'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/types/Database'

const getUser = async (): Promise<Profile> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) throw new Error(profileError.message)

  return profile as Profile
}

export const useUser = () => {
  return useQuery<Profile>({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}