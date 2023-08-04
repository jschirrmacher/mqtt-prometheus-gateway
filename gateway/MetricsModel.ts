import type { BaseType, Topic } from "./types"

interface Folder {
  [key: string]: BaseType | Folder
}

export const metrics: Record<Topic, Folder> = {}
