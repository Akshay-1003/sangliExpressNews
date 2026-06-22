"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { HomeIcon, ArrowLeftCircleIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/solid'

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
          <HomeIcon className="h-5 w-5"></HomeIcon>
        ),
        label: "Dashboard",
        route: "/home"
      },

      {
        icon: (
          <UserIcon className="h-5 w-5"></UserIcon>
        ),
        label: "About Us",
        route: "/profile"
      }
    ],
  },

];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <>
      {/* Desktop Sidebar */}
      <ClickOutside onClick={() => setSidebarOpen(false)}>
        <aside
          className={`fixed left-0 top-0 z-9999 hidden lg:flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0`}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-4 ">
            <div className="flex items-center gap-2.5">
            <Link href="/">
              <Image
                width={110}
                height={25}
                src={"/images/logo/logo-dark.png"}
                alt="Logo"
                priority
              />
            </Link>
            <span className="text-xl font-extrabold text-white italic">Sangli Express News</span>
            </div>
          </div>

          <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            <nav className="px-4 py-4 lg:px-6">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                    {group.name}
                  </h3>

                  <ul className="mb-6 flex flex-col gap-1.5">
                    {group.menuItems.map((menuItem, menuIndex) => (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>
      </ClickOutside>

      {/* Mobile Sidebar (Drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-72 bg-black dark:bg-boxdark shadow-xl">
            <div className="flex items-center justify-between gap-2 px-4 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <Link href="/" onClick={() => setSidebarOpen(false)}>
                  <Image
                    width={110}
                    height={25}
                    src={"/images/logo/logo-dark.png"}
                    alt="Logo"
                    priority
                  />
                </Link>
                <span className="text-xl font-extrabold text-white italic">Sangli Express News</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="no-scrollbar flex flex-col overflow-y-auto">
              <nav className="px-4 py-4">
                {menuGroups.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                      {group.name}
                    </h3>

                    <ul className="mb-6 flex flex-col gap-1.5">
                      {group.menuItems.map((menuItem, menuIndex) => (
                        <Link
                          key={menuIndex}
                          href={menuItem.route}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            pathname === menuItem.route
                              ? "bg-blue-600 text-white"
                              : "text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          {menuItem.icon}
                          <span className="font-medium">{menuItem.label}</span>
                        </Link>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white dark:bg-boxdark border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex justify-around items-center py-2">
          {menuGroups[0].menuItems.map((menuItem) => (
            <Link
              key={menuItem.route}
              href={menuItem.route}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                pathname === menuItem.route
                  ? "text-blue-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className="h-6 w-6">
                {menuItem.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{menuItem.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
