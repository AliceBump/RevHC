import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'
import type { User } from '../db'

export interface AppState {
  currentUser?: User
  users: Record<string, User>
}

export const store = new Store<AppState>({
  currentUser: undefined,
  users: {},
})

export const setCurrentUser = (user: User) => {
  store.setState((s) => {
    s.currentUser = user
    s.users[user.id] = user
  })
}

export const useCurrentUser = () => useStore(store, (s) => s.currentUser)
