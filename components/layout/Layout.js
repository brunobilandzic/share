import { useSession } from "next-auth/react";
import NavbarComponent from "./navbar/NavbarComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../../redux/slices/userSlice";
import Modal from "./Modal/Modal"
import { clearError } from "../../redux/slices/errorSlice";
import Loading from "./Loading/Loading";
import { breakLoading, setLoading } from "../../redux/slices/loadingSlice";
import { Router } from "next/router";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const error = useSelector((state) => state.error);
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
    if (!session || isLoggedIn) return;
    if (!isLoggedIn) dispatch(setUser(session.user));
  }, [session]);

  return (
    <div>
      <Loading />
      <NavbarComponent />
      <div className="w-full max-w-6xl mx-auto">
        {error.hasError ? (
          <Modal
            title="Error"
            content={<div>{error.message}</div>}
            onCancel={() => dispatch(clearError())}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
