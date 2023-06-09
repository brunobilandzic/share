import { getSession } from "next-auth/react";
import { joinGroup } from "../../../../lib/usersLib";

export default async function JoinGroupHandler(req, res) {
  if (req.method === "POST") {
    const { groupId } = req.body;
    const session = await getSession({ req });
    if (!session) {
      return res.stats(401).json({ message: "You are not authorized" });
    }

    const result = await joinGroup(
      groupId,
      session.user.email,
      res.socket.server.io
    );

    if (!result?.success) {
      res.status(400).json({ message: result?.error });
      return;
    }
    res.status(200).json({ message: "Group joined" });
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
