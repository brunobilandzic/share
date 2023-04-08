import React, { useEffect } from "react";
import { CreateNewButton } from "../../components/item/CreateItemComponent";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getAllItems } from "../../lib/itemsLib";

export default function ItemsMainPage({ items }) {
  const session = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session.data) {
      dispatch(setError("You are not authorized to view this page"));
      router.push("/");
    }
  }, [session]);

  useEffect(() => {
    items == null && dispatch(setError("Failed fetching items"));
  });


  return (
    <>
      {items?.length}

      <CreateNewButton />
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        items: null,
      },
    };
  }

  const result = await getAllItems();

  if (!result.success) return { props: { items: null } };

  const items = result.items.map((item) => ({
    id: item._id.toString(),
  }));

  return {
    props: {
      items,
    },
  };
}
