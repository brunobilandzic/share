import { getSession } from "next-auth/react";
import { getOrCreateUser } from "../../../lib/auth";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const user = await getOrCreateUser(session.user);
  res.send(user);
}
