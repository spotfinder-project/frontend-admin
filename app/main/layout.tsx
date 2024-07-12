// components/MainLayout.js

"use client";

import { Button } from "@mui/base";
import Link from "next/link";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-10">
        <div className="max-w-7xl ">
          <h1 className="text-2xl">My Application</h1>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <nav className="fixed top-16 left-0 w-64 bg-gray-800 text-white h-full">
          <ul className="space-y-4 p-4">
            <li>
              <Link href="/main/users" passHref>
                <Button className="block w-full text-left p-2 hover:bg-gray-700 rounded">
                  사용자 관리
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/main/facilities" passHref>
                <Button className="block w-full text-left p-2 hover:bg-gray-700 rounded">
                  시설물 관리
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/main/administrators" passHref>
                <Button className="block w-full text-left p-2 hover:bg-gray-700 rounded">
                  관리자 관리
                </Button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Content */}
        <main className="ml-64 p-8 flex-1 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
