import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { CREATION_ERROR } from "../../constants/errorTypes";
import { breakLoading, setLoading } from "../../redux/slices/loadingSlice";
import { setNotify } from "../../redux/slices/notifySlice";

const initialState = {
  name: "",
  description: "",
  available: true,
  reservations: [],
  holder: null,
  group: "",
};

export function CreateItemComponent() {
  const [item, setItem] = useState(initialState);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  
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
        <label htmlFor="group">Group</label>
        <select name="group" value={item.group} onChange={handleChange}>
          <option value="">Select group</option>
          {user.joinedGroups?.map((joinedGroup) => (
            <option key={joinedGroup.group._id}  value={joinedGroup.group._id}>
              {joinedGroup.group.name}
            </option>
          ))}
        </select>
        <button className="btn" onClick={handleSubmit}>
          Submit
        </button>
        <AllItemsButton />
      </form>
    </>
  );
}

export function CreateNewItemButton() {
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

export function ItemThumbnail({ name, id }) {
  return (
    <Link href={`/items/${id}`}>
      <div className="btn">{name}</div>
    </Link>
  );
}

export function Item({ item }) {
  return (
    <>
      {item && (
        <div className="flex flex-col space-y-3">
          <h1 className="text-2xl">{item.name}</h1>
          <p>{item.description}</p>
          <p>{!item.holder ? "Available" : "Unavailable"}</p>
          <p>Reservations: {item.reservations?.length}</p>
          {item.holder && <p>Holder: {item.holder}</p>}
        </div>
      )}
    </>
  );
}

export function ItemList({ items }) {
  return (
    <div className="flex flex-col space-y-2">
      {items.map((item) => (
        <ItemThumbnail key={item.id} {...item} />
      ))}
    </div>
  );
}
