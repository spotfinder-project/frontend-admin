"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const getActiveMenu = (url: string) => {
    return pathname === url ? "font-semibold underline" : "";
  };

  const menu = {
    "/main": "Home",
    "/main/users": "Users",
    "/main/facilities": "Facilities",
    "/main/administrators": "Administrators",
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* NavBar */}
      <div className="navbar bg-base-100">
        <div className="flex-none">
          <label
            className="btn btn-square"
            onClick={handleOpenMenu}
            htmlFor="my-drawer"
          >
            <i className="ri-menu-line text-black h-4 w-4"></i>
          </label>
        </div>
        <div className="flex justify-between ml-4 w-full">
          <h1 className="text-2xl font-bold">
            Spot Finder Admin
            <span>{` > ${menu[pathname as keyof typeof menu]}`} </span>
          </h1>

          <button className="btn btn-neutral">로그아웃</button>
        </div>
      </div>

      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <main className="p-8">{children}</main>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <li className={getActiveMenu("/main")}>
              <Link href="/main">홈</Link>
            </li>
            <li className={getActiveMenu("/main/users")}>
              <Link href="/main/users">사용자 관리</Link>
            </li>
            <li className={getActiveMenu("/main/facilities")}>
              <Link href="/main/facilities">시설물 관리</Link>
            </li>
            <li className={getActiveMenu("/main/administrators")}>
              <Link href="/main/administrators">관리자 관리</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
