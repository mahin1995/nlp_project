"use client";
import CategoryDetails from "@/component/CategoryDetails";
import { usePathname } from "next/navigation";

function Page() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "";
  return (
    <>
      <div>
        <CategoryDetails slug={slug} />
      </div>
    </>
  );
}

export default Page;
