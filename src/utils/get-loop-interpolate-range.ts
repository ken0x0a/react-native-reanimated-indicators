import { range } from './array'

interface GetLoopInterpolateRangesOptions {
  /**
   * - number
   * - ~~string => color | degrees~~
   */
  calcOutputRange: (positionIndex: number) => number // string
  count: number
}

export function getLoopInterpolateRanges({
  count,
  calcOutputRange,
}: GetLoopInterpolateRangesOptions) {
  const inputRange = getLoopInterpolateInputRange({ count })

  const outputRange = getLoopInterpolateOutputRange({ count, calcRange: calcOutputRange })

  return { inputRange, outputRange }
}

interface GetLoopInterpolateInputRangesOptions {
  count: number
}
/**
 * [0..count]
 */
export function getLoopInterpolateInputRange({ count }: GetLoopInterpolateInputRangesOptions) {
  return range(count + 1).map((__, idx) => idx / count)
}

interface GetLoopInterpolateOutputRangesOptions {
  /**
   * - number
   * - ~~string => color | degrees~~
   */
  calcRange: (positionIndex: number) => number // string
  count: number
}
/**
 * []
 */
export function getLoopInterpolateOutputRange({
  count,
  calcRange,
}: GetLoopInterpolateOutputRangesOptions) {
  const outputRange = range(count).map((__, idx) => calcRange(idx))
  outputRange.unshift(outputRange.slice(-1)[0])

  return outputRange
}
