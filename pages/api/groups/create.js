import { getSession } from "next-auth/react";
import { createGroup } from "../../../lib/usersLib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
    
  const result = await createGroup(req.body.name, [], session.user.email);

  if (!result.success) {
    return res.status(400).json({ message: result.error?.message });
  }

  const newGroup = result.group;

  res.status(200).json(newGroup);
}
