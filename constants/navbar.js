import { REGULAR, GUEST, ADMINISTRATOR } from "./roles";

export const navList = [
  {
    roles: [REGULAR, ADMINISTRATOR],
    path: "/groups",
    display: "Groups",
  },
  {
    roles: [REGULAR, ADMINISTRATOR],
    path: "/items",
    display: "Items",
  },
  {
    roles: [REGULAR, ADMINISTRATOR],
    display: "Logout",
    logout: true
  },
  {
    roles: [GUEST],
    display: "Authenticate",
    auth: true
  },
];
