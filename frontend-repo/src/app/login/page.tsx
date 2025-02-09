"use client";

import Layout from "@/components/Layout/layoutPage";
import { signInWithGoogle } from "@/api/auth";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { set: setCookies } = useCookies();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await signInWithGoogle(setCookies);
      toast.success("Successfully signed in with Google.");
      router.replace("/dashboard");
    } catch (error) {
      toast.error("Error signing in with Google, Please try again later.");
    }
  };
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-min-screen mt-[30%]">
        <div className="p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Login</h1>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-md border border-gray-300 transition-colors"
          >
            <div>logo login</div>
            <span className="font-medium">Continue with Google</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
