import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongoDb";
import { getOrCreateUser } from "../../../lib/usersLib";
import { ADMINISTRATOR, REGULAR } from "../../../constants/roles";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.JWT_KEY,
  },
  callbacks: {
    async signIn({ user }) {
      user.email == "bruno.bilandzic2@gmail.com"
        ? (user.roles = [ADMINISTRATOR, REGULAR])
        : (user.roles = [REGULAR]);
      return await getOrCreateUser(user);
    },
  },
};

export default NextAuth(authOptions);
