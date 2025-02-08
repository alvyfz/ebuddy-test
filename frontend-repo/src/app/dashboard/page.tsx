"use client";

import { auth } from "@/config/firebase";
import { signOut } from "@/networks/auth";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const { set: setCookies } = useCookies();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const res = await signOut(setCookies);
      router.replace("/login");
    } catch (error: any) {
      toast.error("Error signing out, Please try again later.");
    }
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
