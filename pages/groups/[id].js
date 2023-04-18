import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setError } from "../../redux/slices/errorSlice";
import { getSession, useSession } from "next-auth/react";
import GroupItem, { AllGroupsButton } from "../../components/users/groups";
import { AUTH_ERROR } from "../../constants/errorTypes";
import { getGroupById } from "../../lib/usersLib";

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
      <GroupItem group={group} />
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

  
    console.log("group sas", result.group.usersRoles);

  const group = {
    id: result.group._id?.toString() || null,
    name: result.group.name || null,
    items:
      result.group.items?.map((item, i) => ({
        itemId: item._id?.toString() || null,
      })) || null,
    description: result.group.description || null,
    createdAt: result.group.createdAt?.toString() || null,
    usersRoles:
      result.group.usersRoles?.map((userRole) => ({
        id: userRole.user?.id?.toString() || null,
        name: userRole.user?.name || null,
        role: userRole?.role || null,
        image: userRole.user?.image || null,
      })) || null,
  };

  return {
    props: {
      group
    },
  };
};
