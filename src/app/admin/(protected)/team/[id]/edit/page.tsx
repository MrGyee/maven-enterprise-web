import { notFound } from "next/navigation";
import { getTeamMemberById } from "@/lib/data/team";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { TeamMemberForm } from "@/components/admin/team/team-member-form";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) notFound();

  return (
    <div>
      <AdminListHeader title={`Edit ${member.name}`} description="Update this team member." />
      <div className="mt-6">
        <TeamMemberForm member={member} />
      </div>
    </div>
  );
}
