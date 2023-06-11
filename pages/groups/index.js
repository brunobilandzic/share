import React, { useEffect } from "react";
import { GroupList, NewGroupButton } from "../../components/users/Groups";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import { getAllGroups } from "../../lib/groupsLib";
import { AUTH_ERROR } from "../../constants/errorTypes";
import { buildGroupForThumbnail, sortByCreatedAt } from "../../util/helpers";

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

  const groups = sortByCreatedAt(
    result.groups.map((group) => buildGroupForThumbnail(group))
  );

  return {
    props: {
      groups,
    },
  };
}
