import axios from "axios";
import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { getItemById } from "../../lib/itemsLib";
import { AllItemsButton, Item } from "../../components/item/Item";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { AUTH_ERROR } from "../../constants/errorTypes";

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

  const item = {
    id: result.item._id?.toString() || null,
    name: result.item.name || null,
    description: result.item.description || null,
    available: result.item.available || null,
    createdAt: result.item.createdAt?.toString() || null,
    reservations:
      result.item.reservations?.map((reservation) => ({
        id: reservation._id?.toString() || null,
        holdDate: reservation.startDate?.toString() || null,
        returnDate: reservation.returnDate?.toString() || null,
        user: reservation.user?.toString() || null,
        comment: reservation.comment || null,
      })) || [],
    holder: result.item.holder || null,
  };

  return {
    props: {
      item,
    },
  };
};
