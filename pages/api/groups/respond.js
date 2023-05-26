import { getSession } from "next-auth/react";
import { respondToJoinGroupRequest } from "../../../lib/usersLib";
import { requestStatus } from "../../../constants/requestStatus";

export default async function RespondHandler(req, res) {
  if (req.method == "POST") {
    const session = await getSession({ req });
    if (!session) {
      res.status(401).json({ message: "You are not authorized" });
      return res.stats(401).json({ message: "You are not authorized" });
    }
    let { joinGroupRequestId, decision } = req.body;
    
    switch (decision) {
      case "ACCEPT":
        decision = requestStatus.ACCEPTED;
        break;
      case "DECLINE":
        decision = requestStatus.REJECTED;
        break;
      default:
        res.status(400).json({ message: "Invalid request" });
        return res.end();
    }

    const result = await respondToJoinGroupRequest(
      joinGroupRequestId,
      session.user.email,
      decision,
      res.socket.server.io
    );

    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }
    return res.end();
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
}
