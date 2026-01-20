"use client"

import { useToast } from "./use-toast"

export function ToastViewer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 shadow-lg text-white ${
            toast.variant === "destructive"
              ? "bg-red-500"
              : "bg-green-600"
          }`}
        >
          <p className="font-semibold">{toast.title}</p>
          <p className="text-sm">{toast.description}</p>
        </div>
      ))}
    </div>
  )
}
