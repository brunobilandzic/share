import React from "react";
import Backdrop from "./Backdrop";
import styles from "./modal.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../../redux/slices/errorSlice";

export default function Modal({ isOpen, title, children, onCancel, footer }) {
  return (
    <>
      {isOpen && (
        <>
          <Backdrop onCancel={onCancel} />
          <div className={`${styles.modal} dark:text-text-default`}>
            <div className="flex items-center justify-between pb-4 mb-3 text-2xl border-b border-b-black">
              <div className="font-bold">{title}</div>
              <FaRegTimesCircle
                onClick={onCancel}
                className="-mb-2 cursor-pointer hover:text-red-500"
              />
            </div>
            <div>{children}</div>
            <div>{footer}</div>
          </div>{" "}
        </>
      )}
    </>
  );
}

export const ErrorModal = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();

  return (
    <>
      <Modal
        isOpen={error.hasError}
        title="An error occurred!"
        footer={
          <div className={`${styles.footer}`}>
            <button
              className="btn close-modal-btn"
              onClick={() => dispatch(clearError())}>
              Okay
            </button>
          </div>
        }
        onCancel={() => dispatch(clearError())}>
        <p>{error.message}</p>
      </Modal>
    </>
  );
};
