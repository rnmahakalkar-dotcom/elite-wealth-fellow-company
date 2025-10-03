export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agents: {
        Row: {
          address: string
          approval_status: Database["public"]["Enums"]["approval_status"]
          approved_at: string | null
          commission_percentage: number
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          pan_number: string
          phone: string
          review_comments: string | null
          reviewed_by: string | null
          submitted_by: string
          updated_at: string
        }
        Insert: {
          address: string
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          commission_percentage: number
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          pan_number: string
          phone: string
          review_comments?: string | null
          reviewed_by?: string | null
          submitted_by: string
          updated_at?: string
        }
        Update: {
          address?: string
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          commission_percentage?: number
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          pan_number?: string
          phone?: string
          review_comments?: string | null
          reviewed_by?: string | null
          submitted_by?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          action: string
          id: string
          new_values: Json | null
          old_values: Json | null
          performed_at: string
          performed_by: string
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by: string
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          performed_at?: string
          performed_by?: string
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      company_investments: {
        Row: {
          approval_status: Database["public"]["Enums"]["approval_status"]
          approved_at: string | null
          created_at: string
          description: string | null
          expected_return: number | null
          id: string
          investment_amount: number
          investment_date: string
          investment_name: string
          plan_id: string
          review_comments: string | null
          reviewed_by: string | null
          submitted_by: string
          updated_at: string
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          created_at?: string
          description?: string | null
          expected_return?: number | null
          id?: string
          investment_amount: number
          investment_date: string
          investment_name: string
          plan_id: string
          review_comments?: string | null
          reviewed_by?: string | null
          submitted_by: string
          updated_at?: string
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          created_at?: string
          description?: string | null
          expected_return?: number | null
          id?: string
          investment_amount?: number
          investment_date?: string
          investment_name?: string
          plan_id?: string
          review_comments?: string | null
          reviewed_by?: string | null
          submitted_by?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_investments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_pii_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          accessed_by: string
          customer_id: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          accessed_by: string
          customer_id: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          accessed_by?: string
          customer_id?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          aadhar_number: string
          address: string
          approval_status: Database["public"]["Enums"]["approval_status"]
          approved_at: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          investment_amount: number
          last_name: string
          pan_number: string
          phone: string
          plan_id: string
          review_comments: string | null
          reviewed_by: string | null
          submitted_by: string
          updated_at: string
        }
        Insert: {
          aadhar_number: string
          address: string
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          investment_amount: number
          last_name: string
          pan_number: string
          phone: string
          plan_id: string
          review_comments?: string | null
          reviewed_by?: string | null
          submitted_by: string
          updated_at?: string
        }
        Update: {
          aadhar_number?: string
          address?: string
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          investment_amount?: number
          last_name?: string
          pan_number?: string
          phone?: string
          plan_id?: string
          review_comments?: string | null
          reviewed_by?: string | null
          submitted_by?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_schedules: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          id: string
          is_paid: boolean
          paid_at: string | null
          payment_date: string
          payment_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_date: string
          payment_type?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_date?: string
          payment_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_schedules_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          id: string
          customer_id: string
          schedule_id: string | null
          amount: number
          status: string
          method: string
          reference_no: string | null
          paid_at: string | null
          created_at: string
          submitted_by: string
        }
        Insert: {
          id?: string
          customer_id: string
          schedule_id?: string | null
          amount: number
          status?: string
          method: string
          reference_no?: string | null
          paid_at?: string | null
          created_at?: string
          submitted_by: string
        }
        Update: {
          id?: string
          customer_id?: string
          schedule_id?: string | null
          amount?: number
          status?: string
          method?: string
          reference_no?: string | null
          paid_at?: string | null
          created_at?: string
          submitted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "payment_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_gifts: {
        Row: {
          id: string
          agent_id: string
          payment_id: string
          gift_type: string
          gift_value: number
          gift_description: string | null
          status: string
          granted_at: string | null
          created_at: string
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          agent_id: string
          payment_id: string
          gift_type: string
          gift_value: number
          gift_description?: string | null
          status?: string
          granted_at?: string | null
          created_at?: string
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          agent_id?: string
          payment_id?: string
          gift_type?: string
          gift_value?: number
          gift_description?: string | null
          status?: string
          granted_at?: string | null
          created_at?: string
          reviewed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_gifts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_gifts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          duration_months: number
          id: string
          investment_amount: number
          is_active: boolean
          name: string
          return_percentage: number
          segment: Database["public"]["Enums"]["plan_segment"]
          terms_document_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          duration_months: number
          id?: string
          investment_amount: number
          is_active?: boolean
          name: string
          return_percentage: number
          segment: Database["public"]["Enums"]["plan_segment"]
          terms_document_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          duration_months?: number
          id?: string
          investment_amount?: number
          is_active?: boolean
          name?: string
          return_percentage?: number
          segment?: Database["public"]["Enums"]["plan_segment"]
          terms_document_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_customer_secure: {
        Args: { action: string; comments?: string; customer_id: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_customer_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          approved_customers: number
          pending_approvals: number
          rejected_customers: number
          total_customers: number
        }[]
      }
      get_customers_by_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          aadhar_number: string
          address: string
          approval_status: Database["public"]["Enums"]["approval_status"]
          approved_at: string
          created_at: string
          data_access_level: string
          email: string
          first_name: string
          id: string
          investment_amount: number
          last_name: string
          pan_number: string
          phone: string
          plan_id: string
          review_comments: string
          reviewed_by: string
          submitted_by: string
        }[]
      }
      has_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_manager_or_above: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_customer_pii_access: {
        Args: { access_type: string; customer_id: string }
        Returns: undefined
      }
      make_first_user_super_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      plan_segment: "PRE-IPO" | "REAL ESTATE" | "DIRECT"
      user_role: "super_admin" | "manager" | "office_staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_status: ["pending", "approved", "rejected"],
      plan_segment: ["PRE-IPO", "REAL ESTATE", "DIRECT"],
      user_role: ["super_admin", "manager", "office_staff"],
    },
  },
} as const
