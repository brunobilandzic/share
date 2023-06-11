import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import GroupItem, { AllGroupsButton } from "../../components/users/Groups";
import { AUTH_ERROR } from "../../constants/errorTypes";
import { getGroupById } from "../../lib/groupsLib";
import { buildGroup } from "../../util/helpers";

export default function SingleGroupPage({ group }) {
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
      {group && <GroupItem group={group} />}
      <AllGroupsButton />{" "}
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

  const result = await getGroupById(id);
  if (!result.success) return { notFound: true };

  const group = buildGroup(result.group);

  return {
    props: {
      group,
    },
  };
};
