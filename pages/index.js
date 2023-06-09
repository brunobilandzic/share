import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { breakLoading, setLoading } from "../redux/slices/loadingSlice";
import { setNotify } from "../redux/slices/notifySlice";

export default function Home() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const sendRestrictedRequest = async () => {
    const response = await axios.get("/api/restricted");
    console.log(response.data);
  };

  const sendRequest = async () => {
    dispatch(setLoading());
    const response = await axios.get("/api/users/all");
    console.log(response.data);
    dispatch(breakLoading());
  };

  const seedUsers = async () => {
    dispatch(setLoading());
    const response = await axios.get("/api/seed/users");
    dispatch(setNotify({ message: response.data.message, title: "Success" }));
    dispatch(breakLoading());
  };

  const seedGroups = async () => {
    dispatch(setLoading());
    const response = await axios.get("/api/seed/groups");
    dispatch(setNotify({ message: response.data.message, title: "Success" }));
    dispatch(breakLoading());
  };

  const seedReservations = async () => {
    dispatch(setLoading());
    const response = await axios.get("/api/seed/reservations");
    dispatch(setNotify({ message: response.data.message, title: "Success" }));
    dispatch(breakLoading());
  };

  if (session) {
    return (
      <div className="flex flex-col">
        <div className="btn" onClick={seedUsers}>
          Seed Users and items
        </div>
        <div className="btn" onClick={seedGroups}>
          Seed Groups
        </div>
        <div className="btn" onClick={seedReservations}>
          Seed Reservations
        </div>
        <div className="btn" onClick={sendRequest}>
          Send request
        </div>
        Signed in as {session.user.email}
        <div className="btn" onClick={() => signOut()}>
          Sign out
        </div>
        <div className="btn" onClick={sendRestrictedRequest}>
          Send restricted request
        </div>
        <Link href="/authorizedpage">
          <div className="btn">Authorized page</div>
        </Link>
      </div>
    );
  } else
    return (
      <div className="flex flex-col">
        <div className="btn" onClick={seedUsers}>
          Seed Users and items
        </div>
        <div className="btn" onClick={seedGroups}>
          Seed Groups
        </div>
        <div className="btn" onClick={seedReservations}>
          Seed Reservations
        </div>
        <Link href="/items">
          <div className="btn">Items</div>
        </Link>
        <div className="btn" onClick={sendRequest}>
          Send request
        </div>
        <div className="btn" onClick={() => signIn()}>
          Sign in
        </div>
      </div>
    );
}
