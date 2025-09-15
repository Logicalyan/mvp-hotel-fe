
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token) {
    redirect("/login");
  }

  if (role === "admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }

  redirect("/404")
}
