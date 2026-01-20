"use client"

import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastState = {
  toasts: ToastProps[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

let state: ToastState = { toasts: [] }

const listeners: Array<(state: ToastState) => void> = []

function dispatch(action: any) {
  state = reducer(state, action)
  listeners.forEach((listener) => listener(state))
}

function reducer(state: ToastState, action: any): ToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

function toast({ title, description, variant }: Omit<ToastProps, "id">) {
  const id = Math.random().toString(36).slice(2)

  dispatch({
    type: "ADD_TOAST",
    toast: { id, title, description, variant },
  })

  if (!toastTimeouts.has(id)) {
    const timeout = setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", toastId: id })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(id, timeout)
  }
}

function useToast() {
  const [stateValue, setStateValue] = React.useState(state)

  React.useEffect(() => {
    listeners.push(setStateValue)
    return () => {
      const index = listeners.indexOf(setStateValue)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toast,
    toasts: stateValue.toasts,
  }
}

export { useToast }
