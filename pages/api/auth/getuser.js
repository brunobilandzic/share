import { getSession } from "next-auth/react";
import { getOrCreateUser } from "../../../lib/usersLib";
import { ADMINISTRATOR, REGULAR } from "../../../constants/roles";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).send("Unauthorized");
    return;
  }
  const user = await getOrCreateUser({
    ...session.user,
    roles:
      session.user.email == "bruno.bilandzic2@gmail.com"
        ? [ADMINISTRATOR, REGULAR]
        : [REGULAR],
  });
  res.send(user);
}
