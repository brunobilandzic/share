import axios from "axios";
import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { getItemById } from "../../lib/itemsLib";
import { AllItemsButton } from "../../components/item/Item";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { AUTH_ERROR, FETCH_ERROR } from "../../constants/errorTypes";

export default function SingleItem({ item }) {
  const session = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(item);
  });

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
      {JSON.stringify(item)}
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

  const item = {
    id: result.item._id?.toString() || null,
    name: result.item.name || null,
    description: result.item.description || null,
    available: result.item.available || null,
    createdAt: result.item.createdAt?.toString() || null,
    reservations: result.item.reservations || null,
    holder: result.item.holder || null,
  };

  return {
    props: {
      item,
    },
  };
};
