declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

declare type RefType<T> = T | null

declare type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]

declare type EmitType = ReturnType<typeof defineEmits>

declare type TargetContext = '_self' | '_blank'

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

/**
 * 任意类型的函数
 */
type AnyFunction = AnyNormalFunction | AnyPromiseFunction

/**
 * 字符串类型对象
 */
type Recordable<T = any> = Record<string, T>

/**
 *  T | null 包装
 */
type Nullable<T> = T | null
