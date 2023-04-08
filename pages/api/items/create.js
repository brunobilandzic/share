import { getSession } from "next-auth/react";
import { createItem } from "../../../lib/itemsLib";

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

  const result = await createItem(req.body);

  if (!result.success) {
    res.status(400).json({ message: result.error });
    return;
  }

  const newItem = result.item;

  res.status(200).json(newItem);
}
