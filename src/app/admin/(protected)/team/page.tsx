import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getTeam } from "@/lib/data/team";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTeamMember } from "@/app/actions/admin/team";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const team = await getTeam();

  return (
    <div>
      <AdminListHeader
        title="Team"
        description={`${team.length} team members.`}
        newHref="/admin/team/new"
        newLabel="Add Team Member"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="relative size-9 overflow-hidden rounded-full">
                    <Image src={member.image.url} alt={member.image.alt} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                <TableCell className="text-muted-foreground">{member.role}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/team/${member.id}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteTeamMember.bind(null, member.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
