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
    <div className="relative cursor-pointer dark:hover:text-text-darkLighter hover:text-text-lighter">
      <FaBell />
      {unreadCount > 0 && (
        <div className="absolute px-2 text-sm border rounded-lg top-2 left-1 border-text-default bg-background-lighterDark dark:bg-">
          {unreadCount}
        </div>
      )}
    </div>
  );
}
