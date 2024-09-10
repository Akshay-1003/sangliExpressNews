"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/provider/AuthProvider";
import { UserCircleIcon,UserIcon,PencilSquareIcon ,ArrowRightEndOnRectangleIcon,ArrowLeftEndOnRectangleIcon} from "@heroicons/react/24/solid";
import { useUser } from "@/hooks/useFetchUserInfo";

const DropdownUser = () => {
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { userInfo, error, loading } = useUser() ?? {};
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="h-12 w-12 rounded-full">
          <UserCircleIcon className="h-10 w-10"></UserCircleIcon>
        </span>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
              <li>
                <Link
                  href="/profile"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <UserIcon className="h-5 w-5"></UserIcon>
                  My Profile
                </Link>
              </li>

            {!userInfo && (
              <>
                <li>
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  ><ArrowRightEndOnRectangleIcon className="h-5 w-5"></ArrowRightEndOnRectangleIcon>
                    Log In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/signup"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    <PencilSquareIcon className="h-5 w-5"></PencilSquareIcon>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          <button
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            onClick={() => handleSignOut()}
          >
           <ArrowLeftEndOnRectangleIcon className="h-5 w-5"></ArrowLeftEndOnRectangleIcon>
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
