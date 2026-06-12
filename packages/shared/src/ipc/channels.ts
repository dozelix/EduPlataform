// ======================================================
// SHARED TYPES — IPC Channels
// Tipos de canales IPC compartidos entre main y frontend
// ======================================================

export const IPC_CHANNELS = {
  // User channels
  USER_GET_ALL: 'user:get-all',
  USER_GET_BY_ID: 'user:get-by-id',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // DB status
  DB_STATUS: 'db:status',
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]
