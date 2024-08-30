import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash-es'
import { type App, type Component, unref } from 'vue'
import { isArray, isObject } from '@/utils/is'

export function utilStringQs(str: string): any {
  let i = 0
  while (i < str.length && (str[i] === '?' || str[i] === '#')) i++
  str = str.slice(i)

  return str.split('&').reduce((obj: any, pair: string) => {
    const parts = pair.split('=')
    if (parts.length === 2)
      obj[parts[0]] = parts[1] === null ? '' : decodeURIComponent(parts[1])

    return obj
  }, {})
}

export function utilQsString(obj: any, noencode: boolean): string {
  // encode everything except special characters used in certain hash parameters:
  // "/" in map states, ":", ",", {" and "}" in background
  function softEncode(s: string) {
    return encodeURIComponent(s).replace(/(%2F|%3A|%2C|%7B|%7D)/g, decodeURIComponent)
  }

  return Object.keys(obj)
    .sort()
    .map((key) => {
      return `${encodeURIComponent(key)}=${noencode ? softEncode(obj[key]) : encodeURIComponent(obj[key])}`
    })
    .join('&')
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = ''
  for (const key in obj)
    parameters += `${key}=${encodeURIComponent(obj[key])}&`

  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace',
): T & U {
  if (!target)
    return source as T & U

  if (!source)
    return target as T & U

  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual)
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual)
        case 'concat':
          return sourceValue.concat(targetValue)
        case 'replace':
          return targetValue
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`)
      }
    }
    if (isObject(targetValue) && isObject(sourceValue))
      return deepMerge(sourceValue, targetValue, mergeArrays)

    return undefined
  })
}

// https://github.com/vant-ui/vant/issues/8302
interface EventShim {
  new(...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void
    }
  }
}

export type WithInstall<T> = T & {
  install: (app: App) => void
} & EventShim

export type CustomComponent = Component & { displayName?: string }

export function withInstall<T extends CustomComponent>(component: T, alias?: string) {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName
    if (!compName)
      return
    app.component(compName, component)
    if (alias)
      app.config.globalProperties[alias] = component
  }
  return component as WithInstall<T>
}

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body
}

// dynamic use hook props
export function getDynamicProps<T extends Record<string, unknown>, U>(props: T): Partial<U> {
  const ret: Recordable = {}

  Object.keys(props).forEach((key) => {
    ret[key] = unref((props as Recordable)[key])
  })

  return ret as Partial<U>
}
