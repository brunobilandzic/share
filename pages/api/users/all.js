import { getAllUsers } from "../../../lib/usersLib";

export default async function handler(req, res) {
  const result = await getAllUsers();
  if (!result.success)
    return res.status(500).json({ success: false, error: result.error });
  return res.status(200).json({ ...result });
}