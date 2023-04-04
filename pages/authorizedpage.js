import { getSession, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../redux/slices/errorSlice";
import { useRouter } from "next/router";
import axios from "axios";

export default function Authorizedpage({ articles }) {
  const session = useSession()
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session.data) {
      dispatch(setError("You are not authorized to view this page"));
      router.push("/");  
    }
  }, [session]);

  return <div>{articles?.data.length}</div>;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session)
    return {
      props: {},
    };

  const res = await axios.get("https://api.artic.edu/api/v1/artworks");
  return {
    props: { articles: res.data },
  };
}
