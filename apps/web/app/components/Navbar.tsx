"use client";

import Link from "next/link";
import MenuIcon from "./MenuIcon";
import ProfileMenu from "./ProfileMenu";
import { useUserSession } from "../hooks/UserSession";
import { AuthMenuItems } from "../utils/MenuItems";

export default function Navbar() {
  const { session, status } = useUserSession();
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost text-xl">
          Chat App
        </Link>
      </div>
      <div className="flex">
        {status === "loading" ? null : session ? (
          <ProfileMenu />
        ) : (
          <div className="flex gap-2">
            {AuthMenuItems.map((menu, index) => (
              <Link href={menu.href} key={index} className="btn btn-ghost">
                {menu.label}
              </Link>
            ))}
          </div>
        )}
        <div className="flex justify-center items-center">
          <MenuIcon />
        </div>
      </div>
    </div>
  );
}
