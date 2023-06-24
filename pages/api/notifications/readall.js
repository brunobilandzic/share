import { readAllNotifications } from "../../../lib/notifications";
import { getUserId } from "../../../lib/usersLib";
import { getSession } from "next-auth/react";

export default async function readAllNotificationsHandler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = await getUserId(session.user.email);
  if (!userId.success) {
    return res.status(200).json({ error: result.error });
  }

  const result = await readAllNotifications(userId.userId);
  if (!result.success) {
    return res.status(200).json({ error: result.error });
  }
  return res.status(200).json(result);
}
