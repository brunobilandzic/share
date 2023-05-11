import { getSession } from "next-auth/react";
import { getAllNotificationsForUser } from "../../../lib/notifications";
import { getUserId } from "../../../lib/usersLib";

export default async function NotificationsHandler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = await getUserId(session.user.email);
  if (!userId.success) {
    return res.status(500).json({ error: result.error });
  }
    const result = await getAllNotificationsForUser(userId.userId);
    if (!result.success) {
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json({ notifications: result.notifications });
}
