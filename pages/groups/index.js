import React, { useEffect } from "react";
import { GroupList, NewGroupButton } from "../../components/users/groups";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import { getAllGroups } from "../../lib/usersLib";
import { AUTH_ERROR } from "../../constants/errorTypes";

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
          <h1 className="text-2xl">Groups</h1>
          {groups && <GroupList groups={groups} />}
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
  }));

  return {
    props: {
      groups,
    },
  };
}
