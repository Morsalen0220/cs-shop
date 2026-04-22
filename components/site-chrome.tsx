"use client";

import AnnouncementBar from "@/components/announcement-bar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface SiteChromeProps {
  children: React.ReactNode;
  footer: React.ReactNode;
  navbar: React.ReactNode;
}

const SiteChrome: React.FC<SiteChromeProps> = ({ children, footer, navbar }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isShopPage = pathname.startsWith("/shop");

  useEffect(() => {
    document.body.classList.toggle("shop-page", isShopPage);

    return () => {
      document.body.classList.remove("shop-page");
    };
  }, [isShopPage]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {!isShopPage ? <AnnouncementBar /> : null}
      {navbar}
      {children}
      {footer}
    </>
  );
};

export default SiteChrome;
