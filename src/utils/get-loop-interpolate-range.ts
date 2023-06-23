import { range } from "./array";

interface GetLoopInterpolateInputRangesOptions {
  count: number;
}
/**
 * @return [0..count]
 */
export function getLoopInterpolateInputRange({ count }: GetLoopInterpolateInputRangesOptions): number[] {
  "worklet";

  return range(count + 1).map((_, idx) => idx / count);
}

interface GetLoopInterpolateOutputRangesOptions {
  /**
   * - number
   * - ~~string => color | degrees~~
   */
  calcRange: (positionIndex: number) => number; // string
  count: number;
}

/**
 * []
 */
export function getLoopInterpolateOutputRange({
  count,
  calcRange,
}: GetLoopInterpolateOutputRangesOptions): number[] {
  "worklet";

  const outputRange = range(count).map((_, idx) => calcRange(idx));
  outputRange.unshift(outputRange.slice(-1)[0]);

  return outputRange;
}

type GetLoopInterpolateRangesOptions = {
  /**
   * - number
   * - ~~string => color | degrees~~
   */
  calcOutputRange: (positionIndex: number) => number; // string
  count: number;
};

type GetLoopInterpolateRangesResult = {
  inputRange: number[];
  outputRange: number[];
};
export function getLoopInterpolateRanges({
  count,
  calcOutputRange,
}: GetLoopInterpolateRangesOptions): GetLoopInterpolateRangesResult {
  "worklet";

  const inputRange = getLoopInterpolateInputRange({ count });

  const outputRange = getLoopInterpolateOutputRange({ count, calcRange: calcOutputRange });

  return { inputRange, outputRange };
}
