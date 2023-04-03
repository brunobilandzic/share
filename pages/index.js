import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { breakLoading, setLoading } from "../redux/slices/loadingSlice";

export default function Home() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const sendRestrictedRequest = async () => {
    const response = await axios.get("/api/restricted");
    console.log(response.data);
  };

  const sendRequest = async () => {
    dispatch(setLoading());
    const response = await axios.get("https://api.artic.edu/api/v1/artworks");
    console.log(response.data);
    dispatch(breakLoading());
  };

  if (session) {
    return (
      <div className="flex flex-col">
        <button onClick={sendRequest}>Send request</button>
        Signed in as {session.user.email}
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={sendRestrictedRequest}>Send restricted request</button>
        <Link href="/restrictedpage">Restricred page</Link>
      </div>
    );
  } else
    return (
      <div className="flex flex-col">
        <button onClick={sendRequest}>Send request</button>
        Not signed in
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
}
