//property.d.ts
import { UUID } from './profile';

export interface Property {
  id: UUID;
  title: string;
  description?: string;
  location?: string;
  price_per_night: number;
  owner_id?: UUID;
  created_at?: string;
}