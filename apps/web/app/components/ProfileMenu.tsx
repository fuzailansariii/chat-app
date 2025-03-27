import React from "react";
import UserAvatar from "../assets/UserAvatar.jpg";
import Image from "next/image";
import Link from "next/link";
import { useUserSession } from "../hooks/UserSession";
import { signOut } from "next-auth/react";

export default function ProfileMenu() {
  const { session } = useUserSession();
  return (
    <div className="flex gap-2">
      <div className="flex justify-center items-center">
        <Link href={"/room"} className="btn btn-ghost">
          Room
        </Link>
      </div>
      <div className="dropdown dropdown-end hidden md:block">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <Image src={UserAvatar} alt="User Avatar" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <div className="p-2">
            <h1 className="text-lg font-bold text-center">
              Welcome, {session?.user?.name}
            </h1>
          </div>
          <li>
            <Link href="/profile" className="justify-between">
              Profile
            </Link>
          </li>

          <li>
            <button onClick={() => signOut()}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
