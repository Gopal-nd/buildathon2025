"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Fan,
  Cloud,
  Sprout,
  ScanEye,
  Grid2x2X,
  ArrowUpFromLine,
  MessageCircle,

} from "lucide-react";
import NavbarProfile from "@/components/NavbarProfile";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Component({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });

  useEffect(() => {
    setIsSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    if (!isLargeScreen) setIsSidebarOpen(false);
  };

  const SidebarContent = () => (
    <nav className="space-y-2 flex flex-col h-full justify-between items-start">
      <div>
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg"
          onClick={handleLinkClick}
        >
          <Home className="h-5 w-5 text-primary" />
          <span>Home</span>
        </Link>      
        <Link
          href="/dashboard/farme"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg"
          onClick={handleLinkClick}
        >
          <Sprout   className="h-5 w-5 text-primary" />
          <span>Farm</span>
        </Link>
        <Link
          href="/dashboard/lense"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg"
          onClick={handleLinkClick}
        >
          <ScanEye    className="h-5 w-5 text-primary" />
          <span>Lense</span>
        </Link>
        <Link
          href="/dashboard/recommend"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg"
          onClick={handleLinkClick}
        >
          <ArrowUpFromLine     className="h-5 w-5 text-primary" />
          <span>Tips</span>
        </Link>
        <Link
          href="/dashboard/chat"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg"
          onClick={handleLinkClick}
        >
          <MessageCircle      className="h-5 w-5 text-primary" />
          <span>Chat</span>
        </Link>
        <Link
          href="/dashboard/account"
          className="flex items-center space-x-2 px-4 py-2 rounded-lg"
          onClick={handleLinkClick}
        >
          <CircleUser  className="h-5 w-5 text-primary" />
          <span>My Account</span>
        </Link>
   

      </div>
      <div className="flex items-center">
     {isSidebarOpen &&  <Button onClick={async()=>{
               await authClient.signOut({
                 fetchOptions: {
                   onSuccess: () => {
                     redirect("/sign-in")
                   },
                 },
               });
             }}>
               Logout
             </Button>}
      </div>
    </nav>
  );
  return (
    <div className="min-h-screen mx-auto ">
      <header className="flex items-center justify-between p-2 border-b">
        <div className="flex gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary flex gap-1 items-center">
            <Fan /> AGRO AI
            </span>
          </Link>
          {isLargeScreen && (
            <Button
              size="icon"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <NavbarProfile />
          {!isLargeScreen && (
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  {isSidebarOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>
      <div className="flex h-[100%]">
        {isLargeScreen && (
          <aside
            className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-0"}`}
          >
            <div
              className={`h-[calc(100vh-65px)] p-4 overflow-hidden ${isSidebarOpen ? "border-r" : ""}`}
            >
              <SidebarContent />
            </div>
          </aside>
        )}
        <main className="flex-1 ">{children}</main>
      </div>
    </div>
  );
}