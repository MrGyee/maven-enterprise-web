import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getServices } from "@/lib/data/services";
import { AdminListHeader } from "@/components/admin/admin-list-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteService } from "@/app/actions/admin/services";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <AdminListHeader
        title="Services"
        description={`${services.length} installation services.`}
        newHref="/admin/services/new"
        newLabel="Add Service"
      />
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.slug}>
                <TableCell>
                  <div className="relative size-10 overflow-hidden rounded-md">
                    <Image src={service.heroImage.url} alt={service.heroImage.alt} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{service.name}</TableCell>
                <TableCell>{service.featured && <Badge variant="secondary">Featured</Badge>}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/services/${service.slug}/edit`}
                      className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteButton action={deleteService.bind(null, service.slug)} />
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
