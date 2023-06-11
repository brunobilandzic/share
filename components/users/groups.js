import React, { useEffect, useState } from "react";
import Link from "next/link";
import { breakLoading, setLoading } from "../../redux/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setNotify } from "../../redux/slices/notifySlice";
import { setError } from "../../redux/slices/errorSlice";
import { CREATION_ERROR } from "../../constants/errorTypes";
import { setUser } from "../../redux/slices/userSlice";
import Modal from "../layout/modal/Modal";
import { confirmTypes } from "../../constants/confirmTypes";
import { requestStatus } from "../../constants/requestStatus";

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
          <JoinGroupButton groupId={group.id} name={name} />
        </div>
      )}
    </>
  );
}

export function JoinGroupButton({ groupId, name }) {
  const [isInGroup, setIsInGroup] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [confirmText, setConfirmText] = useState(false);
  const [confirmType, setConfirmType] = useState(confirmTypes.OFF);
  const joinedGroups = useSelector((state) => state.user.joinedGroups);
  const [requests, setRequests] = useState(null);
  useEffect(() => {
    if (!joinedGroups) return;
    const inGroup = joinedGroups
      ?.map((joinedGroup) => joinedGroup.group._id)
      .includes(groupId);
    setIsInGroup(inGroup);
    const fetchStatus = async () => {
      const res = await axios.get("/api/groups/request/status", {
        params: { groupId },
      });
      if (!res.data?.requests) {
        setIsRequestSent(false);
        setRequests(null);
      } else {
        setIsRequestSent(true);
        setRequests(res.data.requests);
      }
    };
    fetchStatus();
  }, [joinedGroups]);

  const joinGroup = async () => {
    const res = await axios.post("/api/groups/request/join", { groupId });
    setIsRequestSent(true);
  };

  const leaveGroup = async () => {
    const res = await axios.post("/api/groups/request/leave", { groupId });
    setIsRequestSent(false);
    setIsInGroup(false);
    console.log(res.data);
  };

  const raiseModal = (type) => {
    setConfirmType(type);
    type === confirmTypes.JOIN
      ? setConfirmText(`Are you sure you want to join ${name}?`)
      : setConfirmText(`Are you sure you want to leave ${name}?`);
  };

  return (
    <>
      <Modal
        isOpen={confirmType !== confirmTypes.OFF}
        title="Confirm your choice"
        onCancel={() => setConfirmType(confirmTypes.OFF)}
        footer={
          <>
            <button
              className="mr-2 btn"
              onClick={() => {
                confirmType === confirmTypes.JOIN ? joinGroup() : leaveGroup();
                setConfirmType(confirmTypes.OFF);
              }}>
              Confirm
            </button>
          </>
        }>
        {confirmText}
      </Modal>
      {!isInGroup ? (
        !isRequestSent ||
        requests?.map((req) => req.status == requestStatus.PENDING).length ==
          0 ? (
          <div
            className="btn"
            onClick={() => {
              raiseModal(confirmTypes.JOIN);
            }}>
            Join Group
          </div>
        ) : (
          <div>
            <p>Request status: {requestStatus.PENDING}</p>
            {/* cancel request */}
          </div>
        )
      ) : (
        <div
          className="btn"
          onClick={() => {
            raiseModal(confirmTypes.LEAVE);
          }}>
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
