import { createRoot } from 'solid-js'
import { useSWR } from '../src'

const sleep = (duration) => new Promise((resolve) => setTimeout(duration, resolve))

describe('Default SWR instance', () => {

  test("should heckin work", () => {
    createRoot(async () => {
      let [state] = useSWR('https://jsonplaceholder.typicode.com/posts')
      expect(state.data).toBe(undefined)
      await sleep(1000)
      expect(typeof state.data).toBe('array')
    });
  });
})
