import React, { useEffect } from "react";
import Backdrop from "./Backdrop";
import styles from "./modal.module.css";
import { FaRegTimesCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../../redux/slices/errorSlice";
import { AUTH_ERROR } from "../../../constants/errorTypes";
import { signIn } from "next-auth/react";
import { clearNotify } from "../../../redux/slices/notifySlice";

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
            <div className={`${styles.footer}`}>{footer}</div>
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
        title={`An error occurred! ${error.type}`}
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

export const AuthModal = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) dispatch(clearError());
  }, [isLoggedIn]);

  return (
    <Modal
      isOpen={error.hasError && error.type === AUTH_ERROR}
      title="You need to be logged in!"
      footer={
        <>
          <button className="mr-2 btn" onClick={signIn}>
            Log in
          </button>
          <button
            className="btn close-modal-btn"
            onClick={() => dispatch(clearError())}>
            Okay
          </button>
        </>
      }
      onCancel={() => dispatch(clearError())}>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-center">
          You need to be logged in to access this page. Please log in or sign up
          to continue.
        </p>
      </div>
    </Modal>
  );
};

export const NotifyModal = () => {
  const notify = useSelector((state) => state.notify);
  const dispatch = useDispatch();

  return (
    <Modal
      isOpen={notify.hasNotify}
      title={notify.title}
      onCancel={() => dispatch(clearNotify())}
      footer={
        <>
          <button
            className="btn close-modal-btn"
            onClick={() => dispatch(clearNotify())}>
            Okay
          </button>
        </>
      }>
      <p>{notify.message}</p>
    </Modal>
  );
};
