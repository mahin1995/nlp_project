"use client";
import { usePathname } from "next/navigation";

function Page() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  return (
    <>
      <div>{slug}</div>
    </>
  );
}

export default Page;
