'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Profile, UserStatus } from '@/types/Database'

// ── Types ──────────────────────────────────────────────────
export type ProfileWithChama = Profile & {
  chamas: {
    name: string
    contribution_amount: number
    contribution_frequency: string
  } | null
}

// ── Current logged-in user ─────────────────────────────────
const getUser = async (): Promise<ProfileWithChama> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      *,
      chamas!profiles_chama_id_fkey (
        name,
        contribution_amount,
        contribution_frequency
      )
    `)
    .eq('id', user.id)
    .single()

  if (profileError) throw new Error(profileError.message)
  return profile as ProfileWithChama
}

export const useUser = () => {
  return useQuery<ProfileWithChama>({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}

// ── All platform users (super admin only) ──────────────────
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          chamas!profiles_chama_id_fkey (
            name,
            contribution_amount,
            contribution_frequency
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data as ProfileWithChama[]
    },
  })
}

// ── Toggle user active/suspended ───────────────────────────
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: UserStatus }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status } as unknown as never)
        .eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}