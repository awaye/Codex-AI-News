import { redirect } from "next/navigation";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export default function AdminIndex() {
  redirect("/admin/news");
}
