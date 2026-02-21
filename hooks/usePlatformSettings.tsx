'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

type Setting = { key: string; value: string }

const fetchSettings = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from('platform_settings')
    .select('key, value')

  if (error) throw new Error(error.message)
  return Object.fromEntries(data.map((s: Setting) => [s.key, s.value]))
}

const saveSettings = async (settings: Record<string, string>) => {
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('platform_settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) throw new Error(error.message)
}

export const usePlatformSettings = () => {
  return useQuery({
    queryKey: ['platform_settings'],
    queryFn: fetchSettings,
  })
}

export const useSaveSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform_settings'] })
    },
  })
}