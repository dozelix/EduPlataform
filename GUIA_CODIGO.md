# 🎨 Guía de Código y Estándares

## TypeScript + React Best Practices

### ✅ Componentes Funcionales

```typescript
// ✓ CORRECTO
import React, { ReactNode } from 'react'

interface UserCardProps {
  userId: string
  userName: string
  onDelete?: (id: string) => void
  children?: ReactNode
}

export const UserCard: React.FC<UserCardProps> = ({
  userId,
  userName,
  onDelete,
  children,
}) => {
  return (
    <div className="user-card">
      <h2>{userName}</h2>
      {children}
      {onDelete && (
        <button onClick={() => onDelete(userId)}>Delete</button>
      )}
    </div>
  )
}
```

### ❌ NO Hagas Esto

```typescript
// ✗ Componentes con clases (obsoleto)
class UserCard extends React.Component { }

// ✗ Nombres genéricos
export const Component = () => {}

// ✗ Props sin tipos
const UserCard = (props: any) => {}

// ✗ Variables no tipadas
let user = api.getUser()
```

---

## Organización de Archivos por Feature

```
src/renderer/features/users/
├── components/
│   ├── UserCard.tsx
│   ├── UserForm.tsx
│   └── UserList.tsx
├── pages/
│   ├── UserDetailPage.tsx
│   └── UserListPage.tsx
├── hooks/
│   ├── useUsers.ts
│   ├── useUserForm.ts
│   └── useUserValidation.ts
├── stores/
│   └── useUserStore.ts         # Zustand, Redux, etc.
├── services/
│   └── userService.ts          # API calls
├── types/
│   └── index.ts                # Interfaces User
├── utils/
│   └── userValidation.ts
└── index.ts                    # Export público

// Uso desde otro lado:
import { UserCard } from '@/features/users'
import type { User } from '@/features/users'
```

---

## Typing Correcto

### Interfaces vs Types

```typescript
// ✓ Usa INTERFACE para objetos que serán implementados/extendidos
interface User {
  id: string
  name: string
  email: string
}

interface AdminUser extends User {
  permissions: string[]
}

// ✓ Usa TYPE para uniones, tuplas, aliases
type UserRole = 'admin' | 'user' | 'guest'
type UserID = string & { readonly __brand: 'UserID' }

// ✓ Combina ambos
interface UserWithRole extends User {
  role: UserRole
}
```

### Props Typing

```typescript
// ✓ CORRECTO - Clara y explícita
interface UserListProps {
  users: User[]
  loading: boolean
  onSelect: (user: User) => void
  onDelete?: (id: string) => void
  maxItems?: number
}

export const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  onSelect,
  onDelete,
  maxItems = 10,
}) => {
  // ...
}

// ✗ EVITAR - Demasiado genérica
interface Props {
  [key: string]: any
}

export const UserList = (props: Props) => {}
```

---

## Hooks Personalizados

```typescript
// ✓ CORRECTO
import { useState, useCallback } from 'react'
import { User } from '@/features/users/types'

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: Error | null
  addUser: (user: User) => Promise<void>
  removeUser: (id: string) => Promise<void>
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addUser = useCallback(async (user: User) => {
    setLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(user),
      })
      if (!response.ok) throw new Error('Failed to add user')
      const newUser = await response.json()
      setUsers((prev) => [...prev, newUser])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [])

  const removeUser = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete user')
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [])

  return { users, loading, error, addUser, removeUser }
}
```

---

## Manejo de Estado Global

### Con Zustand (Recomendado para equipos pequeños)

```typescript
// src/renderer/stores/userStore.ts
import { create } from 'zustand'
import type { User } from '@/features/users/types'

interface UserStore {
  users: User[]
  currentUser: User | null
  loading: boolean
  
  // Actions
  setUsers: (users: User[]) => void
  setCurrentUser: (user: User | null) => void
  addUser: (user: User) => void
  removeUser: (id: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  currentUser: null,
  loading: false,

  setUsers: (users) => set({ users }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  addUser: (user) => set((state) => ({
    users: [...state.users, user],
  })),
  removeUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id),
  })),
}))

// Uso en componentes
function UserProfile() {
  const { currentUser, setCurrentUser } = useUserStore()
  
  return <div>{currentUser?.name}</div>
}
```

---

## Manejo de API Calls

```typescript
// src/renderer/services/userService.ts
import axios from 'axios'
import type { User } from '@/features/users/types'

const API_URL = import.meta.env.VITE_API_URL

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users`)
    return response.data
  },

  async getUserById(id: string): Promise<User> {
    const response = await axios.get(`${API_URL}/users/${id}`)
    return response.data
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await axios.post(`${API_URL}/users`, user)
    return response.data
  },

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await axios.put(`${API_URL}/users/${id}`, user)
    return response.data
  },

  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${API_URL}/users/${id}`)
  },
}
```

---

## Manejo de Errores

```typescript
// ✓ CORRECTO - Error handling explícito
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data as User
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to fetch user ${id}:`, message)
    return null
  }
}

// ✓ CORRECTO - En componentes
function UserDetail({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <div>Cargando...</div>
  if (error) return <div className="error">{error}</div>
  if (!user) return <div>No encontrado</div>

  return <div>{user.name}</div>
}
```

---

## Validación de Datos

### Con Zod (Recomendado)

```typescript
// src/shared/types/user.ts
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).max(120).optional(),
})

export type User = z.infer<typeof UserSchema>

// Uso
const userData = { name: 'John', email: 'john@example.com' }
const result = UserSchema.safeParse(userData)

if (!result.success) {
  console.error(result.error.errors)
} else {
  console.log('Válido:', result.data)
}
```

---

## Naming Conventions

| Type | Style | Example |
|------|-------|---------|
| Components | PascalCase | `UserCard.tsx` |
| Files | kebab-case | `user-card.tsx` |
| Hooks | camelCase | `useUsers.ts` |
| Variables | camelCase | `const userName = 'John'` |
| Constants | UPPER_SNAKE_CASE | `const MAX_USERS = 100` |
| Types/Interfaces | PascalCase | `interface UserProps {}` |
| Enums | PascalCase | `enum UserRole {}` |
| Functions | camelCase | `const fetchUsers = () => {}` |

---

## Comentarios

```typescript
// ✓ CORRECTO - Solo cuando la lógica no es obvia
// Recursivamente construir árbol de permisos para user role
function buildPermissionTree(role: UserRole): Permission[] {
  // ...
}

// ✓ CORRECTO - Documentar decisiones no obvias
// Usamos Array.filter en lugar de for loop por performance
// Ver: https://github.com/issue/123
const activeUsers = users.filter(u => u.isActive)

// ✗ EVITAR - Comentarios obvios
// Incrementar contador
count++

// ✗ EVITAR - Comentarios desactualizados
// TODO: Fix this bug (hace 6 meses que está ahí)
```

---

## Tests Unitarios (Vitest)

```typescript
// src/utils/userValidation.test.ts
import { describe, it, expect } from 'vitest'
import { validateEmail } from './userValidation'

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })

  it('should reject invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false)
  })

  it('should reject empty string', () => {
    expect(validateEmail('')).toBe(false)
  })
})
```

---

## Checklist para Code Review

- [ ] ¿Tipos está correctamente tipado (no `any`)?
- [ ] ¿Hay manejo de errores?
- [ ] ¿El nombre de función/variable es descriptivo?
- [ ] ¿Hay tests?
- [ ] ¿El código sigue las convenciones?
- [ ] ¿Hay comentarios solo donde necesario?
- [ ] ¿El PR description es clara?
- [ ] ¿No hay secrets (API keys, passwords)?

---

**Mantener el código limpio mejora la colaboración en equipo.**
