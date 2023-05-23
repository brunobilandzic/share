import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";

import { AUTH_ERROR } from "../../constants/errorTypes";
import { getNotificationById } from "../../lib/notifications";
import { NotificationPage } from "../../components/layout/notifications/notifications";
import { buildNotification } from "../../util/helpers";

export default function SingleNotificationPage({ notification }) {
  const session = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session.data) {
      dispatch(
        setError({
          message: "You are not authorized to view this page",
          type: AUTH_ERROR,
        })
      );
    }
  }, [session]);
  return (
    <div>
      <NotificationPage {...notification} />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { query } = context;
  const { id } = query;

  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        item: null,
      },
    };
  }

    const result = await getNotificationById(id);
    
    const notification = buildNotification(result.notification);

  if (!result.success) return { notFound: true };

  return {
    props: {
      notification
    },
  };
};
