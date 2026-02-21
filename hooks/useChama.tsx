"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Chama, ChamaMember, Profile, Database, ChamaStatus } from "@/types/Database";

export type ChamaWithAdmin = Chama & {
  profiles: Pick<Profile, "full_name" | "email" | "phone_number" | "status"> | null;
  chama_members: { count: number }[];
};

export type ChamaWithDetails = Chama & {
  profiles: Pick<Profile, "full_name" | "email" | "phone_number" | "status" | "created_at"> | null;
  chama_members: (ChamaMember & {
    profiles: Pick<Profile, "id" | "full_name" | "phone_number" | "status"> | null;
  })[];
};

export const useChamas = () => {
  return useQuery({
    queryKey: ["chamas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chamas")
        .select(
          `
          *,
          profiles!chamas_created_by_fkey (
            full_name,
            email,
            phone_number,
            status
          ),
          chama_members (count)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as ChamaWithAdmin[];
    },
  });
};

export const useChama = (id: string) => {
  return useQuery({
    queryKey: ["chamas", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chamas")
        .select(
          `
          *,
          profiles!chamas_created_by_fkey (
            full_name,
            email,
            phone_number,
            status,
            created_at
          ),
          chama_members (
            id,
            role,
            status,
            joined_at,
            user_id,
            profiles (
              id,
              full_name,
              phone_number,
              status
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data as ChamaWithDetails;
    },
    enabled: !!id,
  });
};

export const useToggleChamaStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ChamaStatus }) => {
      const { error } = await supabase
        .from("chamas")
        .update({ status } as unknown as never)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["chamas"] });
      queryClient.invalidateQueries({ queryKey: ["chamas", id] });
    },
  });
};