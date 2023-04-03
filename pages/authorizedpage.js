import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Authorizedpage() {
  const user = useSelector((state) => state.user);
  useEffect(() => console.log("user on client\n", user), [user]);

  return <div>{JSON.stringify(user)}</div>;
}
