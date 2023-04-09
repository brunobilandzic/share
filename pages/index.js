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
    const response = await axios.get("/api/auth/getuser");
    console.log(response.data);
    dispatch(breakLoading());
  };

  if (session) {
    return (
      <div className="flex flex-col">
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
        <Link href="/authorizedpage"><div className="btn">Authorized page</div></Link>
        <Link href="/items"><div className="btn">Items</div></Link>
        <div className="btn" onClick={sendRequest}>Send request</div>
        <div className="btn" onClick={() => signIn()}>Sign in</div>
      </div>
    );
}
