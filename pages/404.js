import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center mt-5 text-center">
      <h1 className="text-6xl font-extrabold">404</h1>
      <small className="mt-2 mb-5">
        Page you are looking for cannot be found.
      </small>
      <Link href="/">
        <div className=" btn">Go back</div>
      </Link>
    </div>
  );
}
