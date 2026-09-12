import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        rollNumber: { label: "Roll Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rollNumber = credentials?.rollNumber as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!rollNumber || !password) return null;

        const student = await prisma.student.findUnique({
          where: { rollNumber: rollNumber.trim().toUpperCase() },
        });
        if (!student || !student.passwordHash) return null;

        const valid = await bcrypt.compare(password, student.passwordHash);
        if (!valid) return null;

        return {
          id: student.id,
          name: student.name,
          rollNumber: student.rollNumber,
          isAdmin: student.isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rollNumber = (user as { rollNumber: string }).rollNumber;
        token.isAdmin = (user as { isAdmin: boolean }).isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rollNumber = token.rollNumber as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
});
