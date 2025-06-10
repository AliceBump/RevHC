import { createAuthClient } from 'better-auth/react'
import { passkeyClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_APP_URL,
  plugins: [passkeyClient()],
})

export const { signIn, signOut, signUp, useSession } = authClient
