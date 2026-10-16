import { redirect } from "next/navigation";

// Giữ URL cũ nhưng không nhân đôi nội dung: chuyển về trang chính /guide-dog.
export default function GuideDogRedirect() {
  redirect("/guide-dog");
}
