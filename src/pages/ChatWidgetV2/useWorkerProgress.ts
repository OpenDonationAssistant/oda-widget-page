import { useEffect, useState } from "react"
import { onWorkerMessage, sendMessageToWorker } from "../../worker"
import type { WorkerProgressMessage } from "../../sw/logger-worker/types"
import type { WorkerStatusMessage } from "../../sw/logger-worker/worker-status"

export interface HandlerError {
  handler: string
  message: string
  timestamp: number
}

export interface WorkerProgress {
  stage: string
  percent: number
  label: string
  handlerErrors: HandlerError[]
}

const ERROR_VISIBLE_MS = 60000

// Placeholder only — replaced by the worker's answer to GetWorkerProgress.
const INITIAL: WorkerProgress = {
  stage: "starting",
  percent: 0,
  label: "Starting...",
  handlerErrors: [],
}

/**
 * Track the logger-worker boot progress plus the last error/warning for
 * each of the given handlers. Errors stay visible for 60 seconds and then
 * are dropped from the returned list.
 */
export function useWorkerProgress(handlers: string[]): WorkerProgress {
  const [progress, setProgress] = useState<WorkerProgress>(INITIAL)
  const handlersKey = handlers.join(",")

  useEffect(() => {
    const unsubscribe = onWorkerMessage((data) => {
      if (!data) return

      if (data.type === "WORKER_PROGRESS") {
        const msg = data as WorkerProgressMessage
        setProgress((prev) => ({
          ...prev,
          stage: msg.stage,
          percent: msg.percent,
          label: msg.label,
        }))
      } 

      if (data.type === "WORKER_STATUS_CHANGED") {
        const status = (data as { status?: WorkerStatusMessage }).status
        if (!status || status.type !== "HandlerError") return
        if (!handlersKey.split(",").includes(status.handler)) return
        const error: HandlerError = {
          handler: status.handler,
          message: status.message ?? "Unknown error",
          timestamp: status.timestamp,
        }
        setProgress((prev) => {
          const filtered = prev.handlerErrors.filter(
            (e) => e.handler !== error.handler,
          )
          return { ...prev, handlerErrors: [...filtered, error] }
        })
      }

    })
    // Ask the worker for its current progress instead of assuming "starting".
    sendMessageToWorker({ type: "GetWorkerProgress" })
    return unsubscribe
  }, [handlersKey])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const cutoff = Date.now() - ERROR_VISIBLE_MS
      setProgress((prev) => {
        const filtered = prev.handlerErrors.filter(
          (e) => e.timestamp >= cutoff,
        )
        if (filtered.length === prev.handlerErrors.length) return prev
        return { ...prev, handlerErrors: filtered }
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return progress
}
