export type QA = {
  q: string
  a: string
}

export type Resp<T> = {
  success: boolean
  data: T
}
