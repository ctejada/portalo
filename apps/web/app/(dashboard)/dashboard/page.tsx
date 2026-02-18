import { Button } from "@/components/ui";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-page-title">Pages</h1>
        <Button size="md">+ New page</Button>
      </div>

      <div className="py-16 text-center">
        <p className="text-body text-text-secondary mb-4">
          No pages yet. Create your first page to get started.
        </p>
        <Button size="md">+ New page</Button>
      </div>
    </div>
  );
}
