import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { CREATION_ERROR } from "../../constants/errorTypes";
import { breakLoading, setLoading } from "../../redux/slices/loadingSlice";
import { setNotify } from "../../redux/slices/notifySlice";
import { useSession } from "next-auth/react"

const initialState = {
  name: "",
  description: "",
  available: true,
  reservations: [],
  holder: null,
};

export function CreateItemComponent() {
  const [item, setItem] = useState(initialState);
  const dispatch = useDispatch();
  const session = useSession();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    dispatch(setLoading());
    try {
      res = await axios.post("/api/items/create", item);
      dispatch(
        setNotify({ message: `You've created ${item.name}`, title: "Success" })
      );
      setItem(initialState);
    } catch (error) {
      dispatch(
        setError({ message: error.response.data.message, type: CREATION_ERROR })
      );
    } finally {
      dispatch(breakLoading());
    }
  };

  return (
    <>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={item.description}
          onChange={handleChange}
        />
        <button className="btn" onClick={handleSubmit}>
          Submit
        </button>
        <AllItemsButton />
      </form>
    </>
  );
}

export function CreateNewButton() {
  return (
    <Link href="/items/create">
      <div className="btn">Create new</div>
    </Link>
  );
}

export function AllItemsButton() {
  return (
    <Link href="/items">
      <div className="btn">All items</div>
    </Link>
  );
}


export function ItemThumbnail({
  name,
  id,
  description,
  available,
  reservations,
  holder,
}) {
  return (
    <Link href={`/items/${id}`}>
      <div className="btn">{name}</div>
    </Link>
  );
}