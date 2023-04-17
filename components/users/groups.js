import React, { useState } from "react";
import Link from "next/link";
import { breakLoading, setLoading } from "../../redux/slices/loadingSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setNotify } from "../../redux/slices/notifySlice";
import { setError } from "../../redux/slices/errorSlice";
import { CREATION_ERROR } from "../../constants/errorTypes";

export default function GroupItem() {
  return <div>groups</div>;
}

export function NewGroupButton() {
  return (
    <Link href="/groups/new">
      <div className="btn">new group</div>
    </Link>
  );
}

const initialGroupState = {
  name: "",
  users: [],
  items: [],
};

export function CreateNewGroup() {
  const [group, setGroup] = useState(initialGroupState);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    dispatch(setLoading());
    try {
      res = await axios.post("/api/groups/create", group);
      dispatch(
        setNotify({ message: `You've created ${group.name}`, title: "Success" })
      );
      setGroup(initialGroupState);
    } catch (error) {
      console.log(error);
      dispatch(
        setError({ message: error.response.data.message, type: CREATION_ERROR })
      );
    } finally {
      dispatch(breakLoading());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        value={group.name}
        onChange={handleChange}
        placeholder="Group name"
      />
      <button className="btn" type="submit">
        Create
      </button>
      <Link href="/groups">
        <div className="btn">All groups</div>
      </Link>
    </form>
  );
}

export function GroupThumbnail({ name, id }) {
  return (
    <Link href={`/groups/${id}`}>
      <div className="btn">{name}</div>
    </Link>
  );
}

export function AllGroupsButton() {
  return (
    <Link href="/groups">
      <div className="btn">All groups</div>
    </Link>
  );
}
