export type UserRole = 'super_admin' | 'admin' | 'member'
export type UserStatus = 'active' | 'suspended'
export type ContributionStatus = 'paid' | 'pending' | 'late'
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'repaid'
export type ContributionFrequency = 'weekly' | 'monthly'

export type Profile = {
  id: string
  full_name: string
  phone_number: string
  email: string
  role: UserRole
  chama_id: string | null
  temp_password: string | null
  is_first_login?: boolean
  status: UserStatus
  avatar_url: string | null
  created_at: string
}

export type Chama = {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  contribution_amount: number
  contribution_frequency: ContributionFrequency
  meeting_day: string | null
  created_by: string
  created_at: string
}

export type ChamaMember = {
  id: string
  chama_id: string
  user_id: string
  role: UserRole
  status: UserStatus
  joined_at: string
}

export type Contribution = {
  id: string
  chama_id: string
  member_id: string
  amount: number
  month: string
  status: ContributionStatus
  mpesa_transaction_id: string | null
  paid_at: string | null
}

export type Loan = {
  id: string
  chama_id: string
  member_id: string
  amount_requested: number
  amount_approved: number | null
  interest_rate: number
  status: LoanStatus
  due_date: string | null
  created_at: string
}

export type Meeting = {
  id: string
  chama_id: string
  title: string
  agenda: string | null
  location: string | null
  meeting_date: string
  minutes: string | null
  created_at: string
}

export type Announcement = {
  id: string
  chama_id: string
  title: string
  message: string
  created_by: string
  created_at: string
}

// supabase database type
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile>
        Update: Partial<Profile>
      }
      chamas: {
        Row: Chama
        Insert: Partial<Chama>
        Update: Partial<Chama>
      }
      chama_members: {
        Row: ChamaMember
        Insert: Partial<ChamaMember>
        Update: Partial<ChamaMember>
      }
      contributions: {
        Row: Contribution
        Insert: Partial<Contribution>
        Update: Partial<Contribution>
      }
      loans: {
        Row: Loan
        Insert: Partial<Loan>
        Update: Partial<Loan>
      }
      meetings: {
        Row: Meeting
        Insert: Partial<Meeting>
        Update: Partial<Meeting>
      }
      announcements: {
        Row: Announcement
        Insert: Partial<Announcement>
        Update: Partial<Announcement>
      }
    }
    Enums: {
      user_role: UserRole
      user_status: UserStatus
      contribution_status: ContributionStatus
      loan_status: LoanStatus
      contribution_frequency: ContributionFrequency
    }
  }
}