import { getSession } from "next-auth/react";
import { getUserId, leaveGroup } from "../../../../lib/usersLib";

export default async function leaveHandler(req, res) {
  console.log("in");
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { groupId } = req.body;

  const email = session.user.email;
  const userIdResponse = await getUserId(email);
  const result = await leaveGroup(groupId, userIdResponse.userId);
  console.log(result);
  if (!result.success) {
    return res.json({ message: result.message });
  }

  return res.json({ success: true, message: "Success" });
}