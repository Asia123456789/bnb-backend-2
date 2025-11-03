export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; full_name?: string; avatar_url?: string; bio?: string };
        Insert: { email: string; full_name?: string; avatar_url?: string; bio?: string };
        Update: { email?: string; full_name?: string; avatar_url?: string; bio?: string };
      };
      properties: {
        Row: { id: number; name: string; description: string; location: string; price_per_night: number; availability: boolean; user_id: string };
        Insert: { name: string; description: string; location: string; price_per_night: number; availability: boolean; user_id: string };
        Update: { name?: string; description?: string; location?: string; price_per_night?: number; availability?: boolean };
      };
      bookings: {
        Row: { id: number; user_id: string; property_id: number; check_in: string; check_out: string; total_price: number; created_at: string };
        Insert: { user_id: string; property_id: number; check_in: string; check_out: string; total_price: number };
        Update: { check_in?: string; check_out?: string; total_price?: number };
      };
    };
  };
}
