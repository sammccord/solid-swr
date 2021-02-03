import {
  SWR,
  SWRKey,
  SWROptions,
  SWRMutateOptions,
  SWRRevalidateOptions,
  CacheClearOptions,
} from 'swrev'
import { createState, onCleanup } from 'solid-js'

interface SWRState<D, E> {
  data?: D,
  error?: E
}

export {
  SWROptions
}

export class SolidSWR extends SWR {
  useSolid<D = any, E = Error>(
    key: SWRKey | undefined | (() => SWRKey | undefined),
    options?: Partial<SWROptions<D>>
  ) {
    // Stores the unsubscription handler
    let unsubscribe = () => {}

    // Contains the data and errors stores.
    const [state, setState] = createState<SWRState<D,E>>({
      data: this.get<D>(this.resolveKey(key)),
      error: undefined
    })

    // Handlers that will be executed when data changes.
    const onData = (d: D) => setState('data', d)
    const onError = (e: E) => setState('error', e)

    // Subscribe and use the SWR fetch using the given key.
    unsubscribe = this.use<D, E>(key, onData, onError, {
      loadInitialCache: false,
      ...options,
    }).unsubscribe

    // Cleanup code to unsubscribe.
    onCleanup(() => unsubscribe())

    // Mutates the current key.
    const mutate = (value: D, options: Partial<SWRMutateOptions<D>>) => {
      return this.mutate(this.resolveKey(key), value, options)
    }

    // Revalidates the current key.
    const revalidate = (options: Partial<SWRRevalidateOptions<D>>) => {
      return this.revalidate(this.resolveKey(key), options)
    }

    // Clears the current key from cache.
    const clear = (options: Partial<CacheClearOptions>) => {
      return this.clear(this.resolveKey(key), options)
    }

    // Return the needed items.
    return [state, { mutate, revalidate, clear }]
  }
}

/**
 * Creates a mew SWR instance and exports basic methods to
 * work with without the need for method calling.
 */
export const createSWR = <D>(options?: Partial<SWROptions<D>>) => {
  const swr = new SolidSWR(options)
  return {
    useSWR: (key: SWRKey, options?: Partial<SWROptions<D>>) => swr.useSolid(key, options),
    mutate: (key: SWRKey, value: D, options?: Partial<SWRMutateOptions<D>>) => swr.mutate(key, value, options),
    revalidate: (key: SWRKey, options?: Partial<SWRRevalidateOptions<D>>) => swr.revalidate(key, options),
    clear: (keys?: string | string[], options?: Partial<CacheClearOptions>) => swr.clear(keys, options),
  }
}

// Default SWR instance to play with.
const swr = createSWR()

// Default instance exports.
export const useSWR = swr.useSWR
export const mutate = swr.mutate
export const revalidate = swr.revalidate
export const clear = swr.clear
