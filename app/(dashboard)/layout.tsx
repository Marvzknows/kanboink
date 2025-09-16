"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";
import { useMe } from "../(auth)/_hooks/useMe";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import FullPageLoader from "@/components/FullPageLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isFetching } = useMe();
  const { setUserAuth, loadingLogout, logout, setUserActiveBoard } =
    useContext(AuthContext);

  useEffect(() => {
    if (data?.data) {
      setUserAuth({
        id: data?.data.id,
        first_name: data?.data.first_name,
        middle_name: data?.data.middle_name || "",
        last_name: data?.data.last_name,
        email: data?.data.email,
        createdAt: data?.data.createdAt,
      });
      setUserActiveBoard(data.data.activeBoard || null);
    }
  }, [data, setUserAuth]);

  const pathname = usePathname();

  // split pathname: "/projects" -> ["projects"]
  const segments = pathname.split("/").filter(Boolean);

  if (isFetching) {
    return <FullPageLoader />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              {segments.length === 0 ? (
                // fallback if user is at "/"
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                segments.map((segment, index) => {
                  const href = "/" + segments.slice(0, index + 1).join("/");
                  const isLast = index === segments.length - 1;
                  const label =
                    segment.charAt(0).toUpperCase() + segment.slice(1);

                  return (
                    <BreadcrumbItem key={href}>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <>
                          <BreadcrumbLink asChild>
                            <Link href={href}>{label}</Link>
                          </BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      )}
                    </BreadcrumbItem>
                  );
                })
              )}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto">
            <ModeToggle />
            <Button
              disabled={loadingLogout}
              onClick={() => logout()}
              className="ml-auto"
              variant="ghost"
            >
              <LogOut />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex flex-col mx-auto w-full">{children}</div>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
