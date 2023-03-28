import { Role } from '@prisma/client'

export const promoteRole = (role: Role): Role => {
  switch (role) {
    case Role.USER:
      return Role.CONTRIBUTOR
    case Role.CONTRIBUTOR:
      return Role.MODERATOR
    case Role.MODERATOR:
      return Role.ADMIN
  }
  return role
}

export const demoteRole = (role: Role): Role => {
  switch (role) {
    case Role.ADMIN:
      return Role.MODERATOR
    case Role.MODERATOR:
      return Role.CONTRIBUTOR
    case Role.CONTRIBUTOR:
      return Role.USER
  }
  return role
}
