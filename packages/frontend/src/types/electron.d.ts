import type { IpcChannel } from '@/shared/src/ipc/channels'
import type { IpcResponse } from '@/shared/src/types/ipcResponse'

// ======================================================
// Window type augmentation
// Tipado de window.api expuesto desde el preload.ts
// ======================================================

declare global {
  interface Window {
    api: {
      invoke: <T = unknown>(channel: IpcChannel, ...args: unknown[]) => Promise<IpcResponse<T>>
      on: (channel: IpcChannel, callback: (...args: unknown[]) => void) => () => void
    }
    IPC_CHANNELS: typeof import('../../shared/src/ipc/channels').IPC_CHANNELS
  }
}

export { }
