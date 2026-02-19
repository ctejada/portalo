"use client";

import { use } from "react";
import { PageEditor } from "@/components/dashboard/page-editor";

export default function PageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <PageEditor pageId={id} />;
}
