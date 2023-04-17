import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import { AllGroupsButton } from "../../components/users/groups";
import { AUTH_ERROR } from "../../constants/errorTypes";
import { getGroupById } from "../../lib/usersLib";

export default function SingleGroup({ group }) {
  const session = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(group);
  });

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

  const group = {
    id: result.group._id?.toString() || null,
    name: result.group.name || null,
    description: result.group.description || null,
    createdAt: result.group.createdAt?.toString() || null,
    users: result.group.users?.map((user, i) => ({
      userId: user._id?.toString() || null,
      role: user.role || null,
    })) || null,
  }

  return {
    props: {
      group
    },
  };
};
