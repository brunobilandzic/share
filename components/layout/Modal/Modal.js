import React from "react";
import Backdrop from "./Backdrop";
import styles from "./modal.module.css";
import { MdOutlineCancel } from "react-icons/md";

export default function Modal({ title, children, onCancel }) {
  return (
    <div>
      <Backdrop onCancel={onCancel} />
      <div className={`${styles.modal} rounded-lg`}>
        <div className="flex justify-between px-3 py-5 bg-red-200 p">
          <div className="font-bold">{title}</div>
          <MdOutlineCancel
            className="text-2xl text-red-900 cursor-pointer hover:text-red-700"
            onClick={onCancel}
          />
        </div>
        <div className="px-3">{children}</div>
        <div className={`${styles.footer} flex justify-end pr-2`}>
          <button
            className="px-1 py-2 m-1 font-semibold text-red-900 border-red-900 hover:text-red-600"
            onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
