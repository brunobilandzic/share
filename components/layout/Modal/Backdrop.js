import React from "react";
import styles from "./modal.module.css";

export default function Backdrop({ onCancel }) {
  return (
    <div
      onClick={onCancel}
      className="fixed top-0 left-0 z-10 w-full h-screen bg-black opacity-80"></div>
  );
}
