import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

function looksLikeBcryptHash(str) {
  return typeof str === "string" && /^\$2[aby]\$/.test(str);
}

async function fetchUserFromTable(email, table) {
  const { data: user, error } = await supabase
    .from(table)
    .select("*")
    .ilike("email", email.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error(`Supabase fetch error from ${table}:`, error);
  }
  return user ?? null;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          throw new Error("Missing email/password/role");
        }

        let user = null;
        const roleRequested = credentials.role.toLowerCase();

        if (roleRequested === "student") {
          user = await fetchUserFromTable(credentials.email, "student_list");
        } else if (
          roleRequested === "teacher" ||
          roleRequested === "staff" ||
          roleRequested === "coach"
        ) {
          user = await fetchUserFromTable(credentials.email, "coaches");
        } else {
          user =
            (await fetchUserFromTable(credentials.email, "student_list")) ||
            (await fetchUserFromTable(credentials.email, "coaches"));
        }

        if (!user) throw new Error("No user found");

        const stored = user.password;
        if (!stored) throw new Error("Invalid password");

        let valid = false;
        if (looksLikeBcryptHash(stored)) {
          valid = await bcrypt.compare(credentials.password, stored);
        } else {
          valid = credentials.password === stored;
        }

        if (!valid) throw new Error("Invalid password");

        const id =
          user.id ??
          user.Student_id ??
          user.student_id ??
          user.coach_display_id ??
          null;

        const name =
          user.name ??
          [user.firstName, user.middleName, user.lastName]
            .filter(Boolean)
            .join(" ") ??
          user.Student_name ??
          user.student_name ??
          "";

        const resolvedRole =
          user.coach_display_id ? "coach" : roleRequested;

        return {
          id,
          email: user.email,
          name,
          role: resolvedRole,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
