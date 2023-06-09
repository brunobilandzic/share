import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal/Modal";
import {
  decisionTypeConstant,
  requestStatus,
} from "../../../constants/requestStatus";
import axios from "axios";
import { setError } from "../../../redux/slices/errorSlice";
import { JOIN_GROUP_REQUEST_ERROR } from "../../../constants/errorTypes";

export function NotificationLIcon() {
  const notifications = useSelector((state) => state.notifications.array);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(getUnreadCount());
  }, [notifications]);

  const getUnreadCount = () => {
    return notifications?.filter((notification) => !notification.read)?.length;
  };
  return (
    <Link href="/notifications">
      <div className="relative cursor-pointer dark:hover:text-text-darkLighter hover:text-text-lighter">
        <FaBell />
        {unreadCount > 0 && (
          <div className="absolute px-2 text-sm border rounded-lg top-2 left-1 border-text-default bg-background-lighterDark dark:bg-">
            {unreadCount}
          </div>
        )}
      </div>
    </Link>
  );
}

export function NotificationsList() {
  const notifications = useSelector((state) => state.notifications.array);
  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <div className="">
      <div className="flex justify-between px-4 py-2 border-b border-text-default dark:border-text-dark">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button className="text-sm">Mark all as read</button>
      </div>
      <div className="pace-y-2 ">
        {notifications?.map((notification) => (
          <NotificationItem key={notification._id} {...notification} />
        ))}
      </div>
    </div>
  );
}

export function NotificationItem({ _id, text, seen, createdAt, user, type }) {

  return (
    <Link href={`/notifications/${_id}`}>
      <div className="relative px-4 py-2 border-b border-text-default dark:border-text-dark">
        <div className="">{text}</div>
        <div className="absolute text-xs text-text-light dark:text-text-darkLighter right-2 bottom-2">
          {createdAt}
        </div>
      </div>
    </Link>
  );
}

export function NotificationPage({
  id,
  text,
  seen,
  createdAt,
  user,
  type,
  joinGroupRequest,
}) {
  const [decisionType, setDecisionType] = useState(decisionTypeConstant.OFF);
  const [responded, setResponded] = useState(
    joinGroupRequest?.status != requestStatus.PENDING
  );
  const dispatch = useDispatch();
  const handleDecision = async () => {
    try {
      const response = await axios.post("/api/groups/respond", {
        joinGroupRequestId: joinGroupRequest.id,
        decision: decisionType,
      });
      setResponded(true);
    } catch (err) {
      dispatch(
        setError({
          message: err.response.data.message,
          type: JOIN_GROUP_REQUEST_ERROR,
        })
      );
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        isOpen={decisionType != decisionTypeConstant.OFF}
        title="Approve Request"
        onCancel={() => setDecisionType(decisionTypeConstant.OFF)}
        footer={
          <>
            <button
              className="mr-2 btn"
              onClick={() => {
                handleDecision();
                setDecisionType(decisionTypeConstant.OFF);
              }}>
              Confirm
            </button>
          </>
        }>
        Are you sure in your choice?
      </Modal>
      <div className="flex flex-col px-4 py-2">
        <div className="">{text}</div>
        {joinGroupRequest && !responded && (
          <div className="flex mt-3 space-x-3">
            <button
              className="btn"
              onClick={() => setDecisionType(decisionTypeConstant.ACCEPT)}>
              Accept
            </button>
            <button
              onClick={() => setDecisionType(decisionTypeConstant.DECLINE)}
              className="btn-danger">
              Decline
            </button>
          </div>
        )}
      </div>
    </>
  );
}
