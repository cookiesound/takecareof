export type UserRole = 'user' | 'admin';

export interface UserRow {
  id: string;
  nickname: string;
  password_hash: string;
  role: UserRole;
  token: string | null;
  level: number;
  exp: number;
  energy: number;
  last_energy_reset_date: string;
  sticker_request_count: number;
  is_sticker_requesting: boolean;
  created_at: string;
  updated_at: string;
}

export interface StickerRequestLogRow {
  id: string;
  user_id: string;
  status: string;
  requested_at: string;
  completed_at: string | null;
  completed_by: string | null;
}

export interface ActivityLogRow {
  id: string;
  user_id: string;
  activity_name: string;
  gained_exp: number;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Omit<UserRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<UserRow>;
      };
      sticker_request_logs: {
        Row: StickerRequestLogRow;
        Insert: Omit<StickerRequestLogRow, 'id' | 'requested_at'> & {
          id?: string;
          requested_at?: string;
        };
        Update: Partial<StickerRequestLogRow>;
      };
      activity_logs: {
        Row: ActivityLogRow;
        Insert: Omit<ActivityLogRow, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<ActivityLogRow>;
      };
    };
  };
}
