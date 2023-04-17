import Image from "next/image";
import React, { useState } from "react";
import { navList } from "../../../constants/navbar";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ADMINISTRATOR, GUEST, REGULAR } from "../../../constants/roles";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "./navbar.module.css";
import DarkModeSwitch from "../DarkMode/DarkModeSwitch";
import { VscChromeClose } from "react-icons/vsc";
import { VscMenu } from "react-icons/vsc";

export default function NavbarComponent() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const activeRoute = router.pathname;

  const getNavlinks = () => {
    const roles = user.roles;
    if (roles.includes(ADMINISTRATOR))
      return getRoleNavLinks(ADMINISTRATOR, activeRoute, setIsNavOpen);
    if (roles.includes(REGULAR))
      return getRoleNavLinks(REGULAR, activeRoute, setIsNavOpen);
    if (!isLoggedIn) 
      return getRoleNavLinks(GUEST, activeRoute, setIsNavOpen);
  };

  return (
    <div className="">
      <div className="relative flex items-center justify-between px-4 py-2">
        <Link href="/" onClick={() => setIsNavOpen(false)}>
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
          <DarkModeSwitch />
          {isLoggedIn && (
            <div className="flex items-center mr-5 space-x-2 text-sm font-thin lg:mr-0">
              {/* image */}
              <span className="">{user.name}</span>
            </div>
          )}
          <nav>
            <ul className="items-center justify-between hidden space-x-4 lg:flex">
              {getNavlinks()}
            </ul>
          </nav>

          <div className="lg:hidden">
            {isNavOpen ? (
              <div className="text-2xl cursor-pointer f hover:text-background-lighterDark">
                <VscChromeClose onClick={() => setIsNavOpen((prev) => !prev)} />
              </div>
            ) : (
              <div className="text-2xl cursor-pointer f hover:text-background-lighterDark ">
                <VscMenu
                  onClick={() => setIsNavOpen((prev) => !prev)}
                  className="text-2xl cursor-pointer hover:text-bold"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {
        <ul
          className={`transition duration-200 lg:hidden ease-in-out space-y-7 mt-2 ${
            isNavOpen ? "flex flex-col" : "hidden"
          } pl-5 `}>
          {getNavlinks()}
        </ul>
      }
    </div>
  );
}

const getRoleNavLinks = (role, activeRoute, setIsNavOpen) => {
  return (
    <>
      {navList
        .filter((x, i) => x.roles.includes(role))
        .map(
          (item, i) =>
            !item.logout && !item.auth && (
              <Link
                className={`${
                  activeRoute.includes(item.path) &&
                  "border-b-2 border-text-default dark:border-text-dark"
                } p-3  ${styles.linkItem}`}
                key={i}
                onClick={() => setIsNavOpen(false)}
                href={item.path}>
                {" "}
                {item.display}
              </Link>
            )
        )}
      {role != GUEST ? (
        <button
          className={`p-3 ${styles.linkItem}`}
          onClick={() => {
            signOut();
            setIsNavOpen(false);
            router.push("/");
          }}>
          Logout
        </button>
      ) : (
        <button
          onClick={() => {
            signIn();
            setIsNavOpen(false);
          }}
          className={`p-3 ${styles.linkItem}`}>
          Auth
        </button>
      )}
    </>
  );
};