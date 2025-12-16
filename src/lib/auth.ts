// src/lib/auth.ts
import NextAuth, { type User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

declare module "next-auth" {
  interface Session {
    user: User
    accessToken?: string
  }

  interface User {
    accessToken?: string
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string
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
        console.log("credentials", credentials)
        // This is where you call your external API
        try {
          const { email, password } = credentials
          const apiResponse = await axios.post("/api/auth/login", { // Note: relative path due to rewrites
            email,
            password,
          })

          const user = apiResponse.data

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
        token.accessToken = user.accessToken // Assuming your API returns an access token
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.user = token.user as any
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
})