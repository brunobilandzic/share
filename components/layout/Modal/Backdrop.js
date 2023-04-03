import React from "react";
import styles from "./modal.module.css";

export default function Backdrop({ onCancel }) {
  return <div onClick={onCancel} className={`${styles.backdrop}`}></div>;
}
