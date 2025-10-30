import { UUID } from './profile';

export interface Booking {
  id: UUID;
  user_id: UUID;
  property_id: UUID;
  check_in: string;
  check_out: string;
  total_price: number;
  created_at?: string;
}