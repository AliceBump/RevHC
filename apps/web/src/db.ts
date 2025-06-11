// Temporary stubs until TanStack DB APIs stabilize
export function createTable<T>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table: any = {}
  table.setName = (name: string) => {
    table.name = name
    return table
  }
  table.setPrimaryKey = (key: keyof T & string) => {
    table.primaryKey = key
    return table
  }
  return table as {
    setName: (name: string) => typeof table
    setPrimaryKey: (key: keyof T & string) => typeof table
  }
}

export function createDatabase<T extends Record<string, unknown>>(tables: T) {
  return tables
}

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
