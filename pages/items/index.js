import React, { useEffect } from "react";
import { CreateNewButton } from "../../components/item/CreateItemComponent";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import { getAllItems } from "../../lib/itemsLib";
import { AUTH_ERROR, FETCH_ERROR } from "../../constants/errorTypes";

export default function ItemsMainPage({ items }) {
  const dispatch = useDispatch();
  const session = useSession();

  useEffect(() => {
    if (!session.data) {
      dispatch(
        setError({
          message: "You are not authorized to view this page",
          type: AUTH_ERROR,
        })
      );
    }
  }, [session]);

  useEffect(() => {
    items == null &&
      dispatch(
        setError({ message: "Failed fetching items", type: FETCH_ERROR })
      );
  }, [items]);

  return (
    <>
      {session.data  && (
        <>
          {items?.length}
          <CreateNewButton />
        </>
      )}
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
    id: item._id?.toString() || null,
    name: item.name,
    description: item.description,
    available: item.available,
    createdAt: item.createdAt?.toString() || null,
    reservations: item.reservations,
    holder: item.holder?.toString() || null,
    createdBy: item.createdBy?.toString() || null,
  }));

  return {
    props: {
      items,
    },
  };
}
