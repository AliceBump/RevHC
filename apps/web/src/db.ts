import { createDatabase, createTable } from '@tanstack/db'

export type Role = 'patient' | 'provider'

export interface User {
  id: string
  name: string
  role: Role
}

export const UsersTable = createTable<User>()
  .setName('users')
  .setPrimaryKey('id')

export const db = createDatabase({
  users: UsersTable,
})
