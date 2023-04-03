import Image from "next/image";
import React, { useState } from "react";
import { navList } from "../../../constants/navbar";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { AUTHORIZED, GUEST } from "../../../constants/roles";
import { signIn, signOut } from "next-auth/react";
import { removeUser } from "../../../redux/slices/userSlice";
import { useRouter } from "next/router";
import styles from "./navbar.module.css";

export default function NavbarComponent() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const router = useRouter();

  const activeRoute = router.pathname;

  const getNavlinks = () =>
    isLoggedIn
      ? navList
          .filter((x) => x.roles.includes(AUTHORIZED))
          .map((item, i) =>
            item.display != "Logout" ? (
              <Link
                className={`${
                  activeRoute.includes(item.path) && styles.active
                } p-3 ${styles.linkItem}`}
                key={i}
                href={item.path}>
                {item.display}
              </Link>
            ) : (
              <button
                className={`${
                  activeRoute.includes(item.path) && styles.active
                } p-3 ${styles.linkItem}`}
                key={i}
                onClick={() => {
                  dispatch(removeUser());
                  signOut();
                  router.push("/");
                }}>
                {item.display}
              </button>
            )
          )
      : navList
          .filter((x) => x.roles.includes(GUEST))
          .map((item, i) => {
            if (item.display == "Authenticate")
              return (
                <button
                  key={i}
                  onClick={signIn}
                  className={`p-3 ${styles.linkItem}`}>
                  {item.display}
                </button>
              );
            else
              return (
                <Link
                  className={`${
                    activeRoute.includes(item.path) && styles.active
                  } p-3 ${styles.linkItem}`}
                  key={i}
                  href={item.path}>
                  {item.display}
                </Link>
              );
          });

  return (
    <div className="mb-10 navbar">
      <div className="relative flex items-center justify-between p-4">
        <Link href="/">
          <Image
            className="cursor-pointer logo"
            src="/images/bmw.png"
            alt="logo"
            width={50}
            height={300}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Link>
        <div className="flex items-center justify-end">
          {isLoggedIn && (
            <div className="flex items-center mr-5 space-x-2 lg:mr-0">
              {/* image */}
              <span className="text-gray-600">{user.userInfo.name}</span>
            </div>
          )}
          <nav>
            <ul className="items-center justify-between hidden space-x-4 lg:flex">
              {getNavlinks()}
            </ul>
          </nav>

          <div className="lg:hidden">
            {isNavOpen ? (
              <svg
                className="w-8 h-8 text-gray-600 cursor-pointer"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => setIsNavOpen((prev) => !prev)}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <div
                className="flex flex-col space-y-2 cursor-pointer hamburger"
                onClick={() => setIsNavOpen((prev) => !prev)}>
                <span className="block h-0.5 w-8 bg-gray-600"></span>
                <span className="block h-0.5 w-8 bg-gray-600"></span>
                <span className="block h-0.5 w-8 bg-gray-600"></span>
              </div>
            )}
          </div>
        </div>
      </div>
      {
        <ul
          className={`flex flex-col transition duration-200 lg:hidden ease-in-out space-y-7 mt-2 ${
            isNavOpen ? "opacity-100 relative" : "opacity-0 absolute"
          } pl-5 `}>
          {getNavlinks()}
        </ul>
      }
    </div>
  );
}
