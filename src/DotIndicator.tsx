import React, { ReactNode, useMemo } from 'react'
import { StyleProp, StyleSheet, ViewProps, ViewStyle } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated'
import {
  ReanimatedLoopState as LoopState,
  useLoop,
  UseLoopOptions,
} from 'react-native-reanimated-hooks'
import { range } from './utils/array'
import {
  getLoopInterpolateInputRange,
  getLoopInterpolateOutputRange,
} from './utils/get-loop-interpolate-range'

const { interpolate } = Animated

const defaultEasing = Easing.bezier(0.3, 0.01, 0.3, 0.15)

type AnimateStyle<S extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof S]: S[K] extends ReadonlyArray<any>
    ? AnimateStyle<S[K][0]>[]
    : S[K] extends object
    ? AnimateStyle<S[K]>
    :
        | S[K]
        | Animated.Node<
            // allow `number` where `string` normally is to support colors
            S[K] extends string ? S[K] | number : S[K]
          >
}

interface IndicatorEnableProps {
  opacityEnabled?: boolean
  scaleEnabled?: boolean
}
interface DotIndicatorProps extends UseLoopOptions, ViewProps, IndicatorEnableProps {
  animating?: Animated.Value<LoopState>
  color?: string
  containerStyle?: StyleProp<ViewStyle>
  count?: number
  dotMargin?: number
  dotSize?: number
  easing?: Animated.EasingFunction
  interval?: number
}

export const DotIndicator: React.FC<DotIndicatorProps> = ({
  // animating
  animating,
  interval = 1000,
  easing = defaultEasing,
  // dot
  color: backgroundColor = 'black',
  dotMargin = 4,
  dotSize = 9,
  count = 3,
  // switch
  opacityEnabled = true,
  scaleEnabled = false,
  // container View
  containerStyle,
  // inner View
  ...viewProps
}) => {
  const animation = useLoop({ animating, interval, easing })

  const dots = useMemo<ReactNode>(() => {
    const dotStyle = {
      backgroundColor,
      marginHorizontal: dotMargin / 2,
      borderRadius: dotSize / 2,
      height: dotSize,
      width: dotSize,
    }

    return range(count).map((_, index) => {
      const count_m1 = count - 1
      const inputRange = getLoopInterpolateInputRange({ count })

      const transform: AnimateStyle<ViewStyle>['transform'] = []
      if (scaleEnabled) {
        transform.push({
          scale: interpolate(animation.position, {
            inputRange,
            outputRange: getLoopInterpolateOutputRange({
              count,
              calcRange: (idx) => 1.0 - (0.46 / count_m1) * ((count_m1 + index - idx) % count),
            }),
          }),
        })
      }

      const animStyle = {
        opacity: opacityEnabled
          ? interpolate(animation.position, {
              inputRange,
              outputRange: getLoopInterpolateOutputRange({
                count,
                calcRange: (idx) => 1 - 0.55 * (((count_m1 + index - idx) % count) / count) ** 0.14,
              }),
            })
          : undefined,
        transform,
      }

      // eslint-disable-next-line react/no-array-index-key
      return <Animated.View style={[dotStyle, animStyle]} key={index} />
    })
  }, [backgroundColor, dotMargin, dotSize, count, scaleEnabled, opacityEnabled, animation.position])

  return (
    <Animated.View style={[styles.container, containerStyle]} {...viewProps}>
      {dots}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
})
