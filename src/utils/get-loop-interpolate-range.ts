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
  /**
   * [0..count]
   */
  const inputRange = range(count + 1).map((__, idx) => idx / count)

  /**
   * []
   */
  const outputRange = range(count).map((__, idx) => calcOutputRange(idx))
  outputRange.unshift(outputRange.slice(-1)[0])

  return { inputRange, outputRange }
}
