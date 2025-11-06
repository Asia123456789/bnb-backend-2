//profile.d.ts
export type UUID = string;

export interface Profile {
  id: UUID;
  full_name?: string;
  is_admin?: boolean;
}
