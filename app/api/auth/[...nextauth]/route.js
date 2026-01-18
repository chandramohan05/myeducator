import NextAuth from "next-auth";
import { authOptions } from "../authOptions";

export { authOptions }; // 🔴 THIS LINE FIXES THE ERROR

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
