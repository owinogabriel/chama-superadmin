import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/Database";

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

  {
    auth: {
      storage:
        typeof window !== "undefined" ? window.sessionStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
