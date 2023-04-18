import React, { useEffect } from "react";
import { CreateNewItemButton, ItemList } from "../../components/item/Item";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import { getAllItems } from "../../lib/itemsLib";
import { AUTH_ERROR } from "../../constants/errorTypes";
import { buildItemForThumbnail, sortByCreatedAt } from "../../util/helpers";

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

  return (
    <>
      {session.data && (
        <>
          {items && <ItemList items={items} />}
          <CreateNewItemButton />
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

  if (!result.success) return { notFound: true };

  const items = sortByCreatedAt(
    result.items.map((item) => buildItemForThumbnail(item))
  );

  return {
    props: {
      items,
    },
  };
}
