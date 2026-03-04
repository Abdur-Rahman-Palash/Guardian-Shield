export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          children: string[]
          guardian_phone: string
          plan: 'free' | 'family' | 'school'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          children: string[]
          guardian_phone: string
          plan?: 'free' | 'family' | 'school'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          children?: string[]
          guardian_phone?: string
          plan?: 'free' | 'family' | 'school'
          updated_at?: string
        }
      }
      risky_sites: {
        Row: {
          id: string
          domain: string
          category: 'porn' | 'gambling' | 'other'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          domain: string
          category: 'porn' | 'gambling' | 'other'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          domain?: string
          category?: 'porn' | 'gambling' | 'other'
          active?: boolean
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          child_name: string
          url: string
          domain: string
          screenshot?: string
          timestamp: string
          guardian_phone: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          child_name: string
          url: string
          domain: string
          screenshot?: string
          timestamp?: string
          guardian_phone: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          child_name?: string
          url?: string
          domain?: string
          screenshot?: string
          timestamp?: string
          guardian_phone?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
