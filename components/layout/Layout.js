import { useSession } from "next-auth/react";
import NavbarComponent from "./navbar/NavbarComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../../redux/slices/userSlice";
import { AuthModal, ErrorModal, NotifyModal } from "./Modal/Modal";
import Loading from "./Loading/Loading";
import { breakLoading, setLoading } from "../../redux/slices/loadingSlice";
import { Router } from "next/router";
import { ThemeProvider } from "next-themes";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

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
      <ErrorModal />
      <AuthModal />
      <NotifyModal />
      <ThemeProvider attribute="class">
        <div className="min-h-screen duration-300 transform-colors bg-background-default dark:bg-background-dark text-text-default dark:text-text-dark">
          <NavbarComponent />

          <div className="w-full max-w-6xl mx-auto">{children}</div>
        </div>
      </ThemeProvider>
    </div>
  );
}
