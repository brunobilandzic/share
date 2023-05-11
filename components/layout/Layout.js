import { useSession } from "next-auth/react";
import NavbarComponent from "./navbar/NavbarComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setUser } from "../../redux/slices/userSlice";
import { AuthModal, ErrorModal, NotifyModal } from "./Modal/Modal";
import Loading from "./Loading/Loading";
import { breakLoading, setLoading } from "../../redux/slices/loadingSlice";
import { Router } from "next/router";
import { ThemeProvider } from "next-themes";
import axios from "axios";
import io from "socket.io-client";
import { setNotification, setNotifications } from "../../redux/slices/notificationSlice";

let socket;

export default function Layout({ children }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [apiUser, setApiUser] = useState(null);

  useEffect(() => {
    socketInitializer();
    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && apiUser) {
      socket.emit("log-in", apiUser._id);
    }
  }, [socket, apiUser]);

  const socketInitializer = async () => {
    await axios.get("/api/socket");

    socket = io();
    socket.on("notification", (data) => {
      dispatch(setNotification(data));
    });
  };

  useEffect(() => {
    if (apiUser) {
      dispatch(setUser(apiUser));
      getNotifications(dispatch);
    }
  }, [apiUser]);

  useEffect(() => {
    const start = () => {
      console.log("start");
      dispatch(setLoading());
    };
    const end = () => {
      console.log("finished");
      dispatch(breakLoading());
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  useEffect(() => {
    const setUser = async () => {
      const { data } = await axios.get("/api/auth/getuser");
      setApiUser(data);
    };
    if (session && !apiUser && !isLoggedIn) {
      setUser();
    }
  }, [session]);

  return (
    <div>
      <Loading />
      <ErrorModal />
      <AuthModal />
      <NotifyModal />
      <ThemeProvider attribute="class">
        <div className="min-h-screen duration-300 transform-colors bg-background-default dark:bg-background-dark text-text-default dark:text-text-dark">
          <NavbarComponent />
          <div className="w-full max-w-6xl px-2 mx-auto">{children}</div>
        </div>
      </ThemeProvider>
    </div>
  );
}

const getNotifications = async (dispatch) => {
  const { data } = await axios.get(`/api/notifications/all`);
  const notifications = data?.notifications;
  dispatch(setNotifications(notifications));
  return notifications;
};
