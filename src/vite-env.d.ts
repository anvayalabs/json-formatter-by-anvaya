
/// <reference types="vite/client" />

// Declare monaco as a global variable
declare global {
  interface Window {
    monaco: any;
  }
}

export {}; // This export makes the file a module, enabling the global augmentation
