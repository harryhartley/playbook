export const isUserModeratorOrAbove = (role: string) => ['MODERATOR', 'ADMIN'].includes(role)
export const isUserAdmin = (role: string) => ['ADMIN'].includes(role)
