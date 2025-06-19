"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import SideBarLayout from "./component/sidbar/SideBarLayout";

export function ComponentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if (!token && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <SideBarLayout>{children}</SideBarLayout>;
}
