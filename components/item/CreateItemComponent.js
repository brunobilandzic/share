import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import Modal from "../layout/Modal/Modal";

const initialState = {
  name: "",
  description: "",
  available: true,
  reservations: [],
  holder: null,
};

export default function CreateItemComponent() {
  const [item, setItem] = useState(initialState);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(item);
    const res = await axios.post("/api/items/create", item);
    console.log(res);
    setItem(initialState);
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
