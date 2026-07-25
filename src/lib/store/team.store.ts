import { createSupabaseCollectionStore } from "./supabase-collection";
import type { TeamMember } from "@/lib/data/types";

interface TeamMemberRow {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  image_alt: string;
}

function toDomain(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    image: { url: row.image_url, alt: row.image_alt },
  };
}

function toRow(t: TeamMember): TeamMemberRow {
  return {
    id: t.id,
    name: t.name,
    role: t.role,
    bio: t.bio,
    image_url: t.image.url,
    image_alt: t.image.alt,
  };
}

export const teamStore = createSupabaseCollectionStore<TeamMemberRow, TeamMember>(
  "team_members",
  "id",
  toDomain,
  toRow
);
