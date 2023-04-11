import React, { useEffect } from "react";
import { CreateItemComponent } from "../../components/item/Item";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { useSession } from "next-auth/react";

export default function CreateItemPage() {
  const session = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session.data) {
      dispatch(setError("You are not authorized to view this page"));
    }
  }, [session]);

  return <CreateItemComponent />;
}
