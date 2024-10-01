"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/service/authService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const getActiveMenu = (url: string) => {
    return pathname.includes(url) ? "font-semibold underline" : "";
  };

  const getBreadcrumbs = (path: string) => {
    const pathArray = path.split("/").slice(2);
    let breadcrumbs = "";
    pathArray.forEach((word) => {
      breadcrumbs += ` > ${word}`;
    });

    return breadcrumbs;
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickLogout = async () => {
    try {
      const response = await logout();

      if (response.status === 200) router.push("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error("로그아웃 할 수 없습니다.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
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
            <span>{`${getBreadcrumbs(pathname)}`} </span>
          </h1>

          <button className="btn btn-neutral" onClick={handleClickLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <main className="p-2 sm:p-8">{children}</main>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 text-lg">
            <li className={getActiveMenu("/main")}>
              <Link href="/main">홈</Link>
            </li>
            <li className={getActiveMenu("/main/users")}>
              <Link href="/main/users">사용자 관리</Link>
            </li>
            <li className={getActiveMenu("/main/facilities")}>
              <Link href="/main/facilities">시설물 관리</Link>
            </li>
            <li className={getActiveMenu("/main/notices")}>
              <Link href="/main/notices">공지사항 관리</Link>
            </li>
            <li className={getActiveMenu("/main/report")}>
              <Link href="/main/report">신고/제보 관리</Link>
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
