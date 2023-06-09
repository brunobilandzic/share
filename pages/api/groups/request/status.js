import { getSession } from "next-auth/react";
import { getRequests } from "../../../../lib/groupsLib";
import { getUserId } from "../../../../lib/usersLib";

export default async function requestHandler(req, res) {
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session) {
      return res.stats(401).json({ message: "You are not authorized" });
    }
    const { groupId } = req.query;
    if (!groupId) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const userIdResponse = await getUserId(session.user.email);
    if (!userIdResponse.success) {
      return res.status(200).json({ message: userIdResponse.error });
    }

    const response = await getRequests(groupId, userIdResponse.userId);
    if (response.requests) {
      return res.status(200).json({ requests: response.requests });
    } else {
      return res.status(200).json({ message: response.message });
    }
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
