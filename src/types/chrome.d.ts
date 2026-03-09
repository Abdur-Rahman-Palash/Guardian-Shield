// Chrome Extension Types for TypeScript
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage: (extensionId?: string, message?: any, callback?: (response?: any) => void) => void
        lastError?: any
        id?: string
      }
      action?: {
        openPopup: () => void
      }
    }
  }
}

export {}
