"use client";

import AnnouncementBar from "@/components/announcement-bar";
import { usePathname } from "next/navigation";

interface SiteChromeProps {
  children: React.ReactNode;
  footer: React.ReactNode;
  navbar: React.ReactNode;
}

const SiteChrome: React.FC<SiteChromeProps> = ({ children, footer, navbar }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      {navbar}
      {children}
      {footer}
    </>
  );
};

export default SiteChrome;
