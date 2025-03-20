"use client"
import ThemeToggle from "@/theme/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import { MODAL_TYPE, useModal } from "./ModalProvider";
import { useAuth } from "./AuthContextProviders";

export default function HeaderFooterLayer({ children }: { children: React.ReactNode }) {
      let {openModal}=useModal()
      let {user}=useAuth()
    
    return <div className="max-w-screen-xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between py-2 border-b">
        <Link
          href="/"
          className="px-2 lg:px-0 uppercase font-bold text-purple-800"
        >
          <Image
            src={"/logo dark.jpg"}
            width={200}
            height={200}
            alt={""} />
        </Link>
        <ul className="inline-flex items-center">
          {[
            { label: "Home", link: "/" },
            { label: "Category", link: "/category" },
            { label: `${user?user:"Login"}`, link: `#` },
           
          ].map((item, index) => (
            <li
              key={index}
              className={`px-2 md:px-4 ${index >= 4 ? "hidden md:block" : ""}`}
            >
              <Link
                href={item?.link}
                onClick={()=>{
                    if(item?.label=='Login'){
                        openModal(MODAL_TYPE.LOGIN)
                    }
                    if(item?.label==user){
                        openModal(MODAL_TYPE.LOGOUT)
                    }
                }}
                className={`text-${index === 0 ? "purple-600" : "gray-500"} font-semibold hover:text-purple-500`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className={`px-2 md:px-4`}>
            <ThemeToggle />
          </li>
        </ul>
      </header>
  
      {children}
      <footer className="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              InsightFeed™
            </a>
            . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
              <a href="/about" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
  
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>;
  }