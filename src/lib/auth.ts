// src/lib/auth.ts
import NextAuth, { type User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { LoginCredentials, loginUser } from "./api/login.service"

declare module "next-auth" {
  interface Session {
    user: User
    token?: string
  }

  interface User {
    token?: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    token?: string
    user?: User
  }
}



export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        // This is where you call your external API
        try {
          const user = await loginUser(credentials as LoginCredentials)
          

          if (user) {
            // The user object returned here will be saved in the JWT
            return user
          }
        } catch (error) {
          console.error("Authorization Error:", error)
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token // Assuming your API returns an access token
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user as any
      session.token = token.token as string
      return session
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
})