import { AUTHORIZED, GUEST } from "./roles";

export const navList = [
  {
    roles: [GUEST, AUTHORIZED],
    path: "/publicpage",
    display: "Public Page",
  },
  {
    roles: [AUTHORIZED],
    path: "/authorizedpage",
    display: "Authorized Page",
  },
  {
    roles: [AUTHORIZED],
    path: "/items",
    display: "Items",
  },
  {
    roles: [AUTHORIZED],
    path: "/logout",
    display: "Logout",
  },
  {
    roles: [GUEST],
    display: "Authenticate",
  },
];
