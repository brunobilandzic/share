import { getSession } from "next-auth/react";

export default async function handler (req, res) {
  const session = await getSession({ req });
  console.log("session on server api\n", session);

  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  res.json({ message: "Hello from restricted page" });
}
