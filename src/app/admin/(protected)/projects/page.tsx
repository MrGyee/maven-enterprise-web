import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getProjects } from "@/lib/data/projects";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProject } from "@/app/actions/admin/projects";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  const projects = getProjects();

  return (
    <div>
      <AdminListHeader
        title="Projects"
        description={`${projects.length} completed projects.`}
        newHref="/admin/projects/new"
        newLabel="Add Project"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.slug}>
                <TableCell>
                  <div className="relative size-10 overflow-hidden rounded-md">
                    <Image src={project.beforeImage.url} alt={project.beforeImage.alt} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{project.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{project.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{project.location}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.slug}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteProject.bind(null, project.slug)} />
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
