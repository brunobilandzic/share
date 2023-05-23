import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";

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

export function NotificationItem({_id, text, seen, createdAt, user, type }) {
  useEffect(() => {
    console.log(_id);
  }, []);

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

export function NotificationPage({ id, text, seen, createdAt, user, type }) {
  useEffect(() => {
    console.log(text);
  }, []);
  return (
    <div className="flex flex-col px-4 py-2">
      <div className="">{text}</div>
    </div>
  );
}
