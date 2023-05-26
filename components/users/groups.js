import React, { useEffect, useState } from "react";
import Link from "next/link";
import { breakLoading, setLoading } from "../../redux/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setNotify } from "../../redux/slices/notifySlice";
import { setError } from "../../redux/slices/errorSlice";
import { CREATION_ERROR } from "../../constants/errorTypes";
import { setUser } from "../../redux/slices/userSlice";

export default function Group({ group }) {
  const { name, description, usersRoles, items, _id } = group;

  return (
    <>
      {group && (
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl">{name}</h1>
          <p>{description}</p>
          <p>{usersRoles?.length} users</p>
          <p>{items?.length} items</p>
          <JoinGroupButton groupId={group.id} />
        </div>
      )}
    </>
  );
}

export function JoinGroupButton({ groupId }) {
  const joinedGroups = useSelector((state) => state.user.joinedGroups);

  const joinGroup = async () => {
    const res = await axios.post("/api/groups/join", { groupId });
    console.log(res);
  };

  const leaveGroup = async () => {};

  return (
    <>
      {!joinedGroups
        ?.map((joinedGroup) => joinedGroup.group._id)
        .includes(groupId) ? (
        <div className="btn" onClick={joinGroup}>
          Join Group
        </div>
      ) : (
        <div className="btn" onClick={leaveGroup}>
          Leave Group
        </div>
      )}
    </>
  );
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
  description: "",
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
      const { data } = await axios.get("/api/auth/getuser");

      dispatch(setUser(data));
      setGroup(initialGroupState);
    } catch (error) {
      console.log(error);
      dispatch(
        setError({
          message: error.response?.data.message,
          type: CREATION_ERROR,
        })
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
      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        value={group.description}
        onChange={handleChange}
        placeholder="Group description"
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

export function GroupThumbnail({ name, id, users }) {
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

export function GroupList({ groups }) {
  return (
    <div className="flex flex-col space-y-2">
      {groups.map((group) => (
        <GroupThumbnail key={group.id} {...group} />
      ))}
    </div>
  );
}
