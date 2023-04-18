import axios from "axios";
import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { getItemById } from "../../lib/itemsLib";
import { AllItemsButton, Item } from "../../components/item/Item";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { AUTH_ERROR } from "../../constants/errorTypes";
import { buildItem } from "../../util/helpers";

export default function SingleItemPage({ item }) {
  const session = useSession();
  const dispatch = useDispatch();

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
    <div>
      <Item item={item} />
      <br /> <AllItemsButton />{" "}
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { query } = context;
  const { id } = query;

  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        item: null,
      },
    };
  }

  const result = await getItemById(id);
  if (!result.success) return { notFound: true };

  const item = buildItem(result.item);

  return {
    props: {
      item,
    },
  };
};
