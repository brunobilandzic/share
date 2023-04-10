import React from "react";
import Link from "next/link";

export default function ItemThumbnail({
  name,
  id,
  description,
  available,
  reservations,
  holder,
}) {
  return (
    <Link href={`/items/${id}`}>
      <div className="btn">{name}</div>
    </Link>
  );
}
