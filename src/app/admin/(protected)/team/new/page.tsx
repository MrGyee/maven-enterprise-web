import { AdminListHeader } from "@/components/admin/admin-list-header";
import { TeamMemberForm } from "@/components/admin/team/team-member-form";

export const dynamic = "force-dynamic";

export default function NewTeamMemberPage() {
  return (
    <div>
      <AdminListHeader title="Add Team Member" description="Add a new team member." />
      <div className="mt-6">
        <TeamMemberForm />
      </div>
    </div>
  );
}
