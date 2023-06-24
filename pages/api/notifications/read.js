import { getSession } from "next-auth/react";
import { readNotification } from "../../../lib/notifications";
import { getUserId } from "../../../lib/usersLib";

export default async function readNotificationHandler(req, res) {
  const { id } = req.body;
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = await getUserId(session.user.email);
  if (!userId.success) {
    return res.status(200).json({ error: userId.error });
  }
  
  const result = await readNotification(id, userId.userId);
  if (!result.success) {
    return res.status(200).json({ error: result.error });
  }
  return res.status(200).json(result);
}
