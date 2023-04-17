import React, { use, useEffect } from "react";
import { GroupThumbnail, NewGroupButton } from "../../components/users/groups";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import { getAllGroups } from "../../lib/usersLib";
import { AUTH_ERROR, FETCH_ERROR } from "../../constants/errorTypes";

export default function Groups({ groups }) {
  const dispatch = useDispatch();
  const session = useSession();

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
    <>
      {session.data && (
        <>
          {groups && groups.map((group, i) => <GroupThumbnail key={i} {...group} />)}
          <NewGroupButton />
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {
        items: null,
      },
    };
  }

  const result = await getAllGroups();
  if (!result.success) return { notFound: true };

  const groups = result.groups.map((group) => ({
    id: group._id?.toString() || null,
    name: group.name,
    users: group.users.map((user) => ({
      userId: user.userId?.toString() || null,
      role: user.role,
    })),
    createdBy: group.createdBy?.toString() || null,
    createdAt: group.createdAt?.toString() || null,
  }));

  return {
    props: {
      groups,
    },
  };
}
