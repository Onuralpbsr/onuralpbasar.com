"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by checking cookie
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/content");
        if (response.ok) {
          // User is authenticated, redirect to dashboard
          router.push("/adminpanel/dashboard");
        } else {
          // User is not authenticated, redirect to login
          router.push("/adminpanel/login");
        }
      } catch (error) {
        // On error, redirect to login
        router.push("/adminpanel/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Yönlendiriliyor...</div>
    </div>
  );
}
