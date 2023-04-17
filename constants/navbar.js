import { REGULAR, GUEST } from "./roles";

export const navList = [
  {
    roles: [REGULAR],
    path: "/groups",
    display: "Groups",
  },
  {
    roles: [REGULAR],
    path: "/items",
    display: "Items",
  },
  {
    roles: [REGULAR],
    path: "/logout",
    display: "Logout",
  },
  {
    roles: [GUEST],
    display: "Authenticate",
  },
];
