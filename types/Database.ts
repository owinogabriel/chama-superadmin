export type UserRole = "super_admin" | "admin" | "member";
export type UserStatus = "active" | "suspended";
export type ContributionStatus = "paid" | "pending" | "late";
export type LoanStatus = "pending" | "approved" | "rejected" | "repaid";
export type ContributionFrequency = "weekly" | "monthly";
export type ChamaStatus = "active" | "suspended";
export type SubscriptionStatus = "active" | "expired" | "pending";

export type Subscription = {
  id: string;
  chama_id: string;
  plan: string;
  amount: number;
  status: SubscriptionStatus;
  payment_method: string;
  start_date: string;
  next_billing_date: string | null;
  mpesa_transaction_id: string | null;
  created_at: string;
};
export type Profile = {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  role: UserRole;
  chama_id: string | null;
  temp_password: string | null;
  is_first_login?: boolean;
  status: UserStatus;
  avatar_url: string | null;
  created_at: string;
};

export type Chama = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  contribution_amount: number;
  contribution_frequency: ContributionFrequency;
  meeting_day: string | null;
  created_by: string;
  plan: string;
  status: ChamaStatus;
  created_at: string;
};

export type ChamaMember = {
  id: string;
  chama_id: string;
  user_id: string;
  role: UserRole;
  status: UserStatus;
  joined_at: string;
};

export type Contribution = {
  id: string;
  chama_id: string;
  member_id: string;
  amount: number;
  month: string;
  status: ContributionStatus;
  mpesa_transaction_id: string | null;
  paid_at: string | null;
};

export type Loan = {
  id: string;
  chama_id: string;
  member_id: string;
  amount_requested: number;
  amount_approved: number | null;
  interest_rate: number;
  status: LoanStatus;
  due_date: string | null;
  created_at: string;
};

export type Meeting = {
  id: string;
  chama_id: string;
  title: string;
  agenda: string | null;
  location: string | null;
  meeting_date: string;
  minutes: string | null;
  created_at: string;
};

export type Announcement = {
  id: string;
  chama_id: string;
  title: string;
  message: string;
  created_by: string;
  created_at: string;
};
export type Setting = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      chamas: {
        Row: Chama;
        Insert: Omit<Chama, "id" | "created_at">;
        Update: Partial<Omit<Chama, "id" | "created_at">>;
      };
      chama_members: {
        Row: ChamaMember;
        Insert: Omit<ChamaMember, "id" | "joined_at">;
        Update: Partial<Omit<ChamaMember, "id" | "joined_at">>;
      };
      contributions: {
        Row: Contribution;
        Insert: Omit<Contribution, "id">;
        Update: Partial<Omit<Contribution, "id">>;
      };
      loans: {
        Row: Loan;
        Insert: Omit<Loan, "id" | "created_at">;
        Update: Partial<Omit<Loan, "id" | "created_at">>;
      };
      meetings: {
        Row: Meeting;
        Insert: Omit<Meeting, "id" | "created_at">;
        Update: Partial<Omit<Meeting, "id" | "created_at">>;
      };
      settings: {
        Row: Setting;
        Insert: Setting;
        Update: Partial<Setting>;
      };
      announcements: {
        Row: Announcement;
        Insert: Omit<Announcement, "id" | "created_at">;
        Update: Partial<Omit<Announcement, "id" | "created_at">>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, "id" | "created_at">;
        Update: Partial<Omit<Subscription, "id" | "created_at">>;
      };
    };
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      contribution_status: ContributionStatus;
      loan_status: LoanStatus;
      contribution_frequency: ContributionFrequency;
      chama_status: ChamaStatus;
    };
  };
};
