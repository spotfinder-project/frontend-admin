import Link from "next/link";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-neutral text-primary-content p-4 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Spot Finder Admin</h1>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <nav className="fixed top-16 left-0 w-64 h-full shadow-lg">
          <ul className="menu p-4 w-full space-y-2">
            <li>
              <Link href="/main">홈</Link>
            </li>
            <li>
              <Link href="/main/users">사용자 관리</Link>
            </li>
            <li>
              <Link href="/main/facilities">시설물 관리</Link>
            </li>
            <li>
              <Link href="/main/administrators">관리자 관리</Link>
            </li>
          </ul>
        </nav>

        {/* Content */}
        <main className="ml-64 p-8 flex-1 bg-base-200">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
