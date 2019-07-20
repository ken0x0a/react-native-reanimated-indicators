import React, { ReactNode, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import {
  ReanimatedLoopState as LoopState,
  useLoop,
  UseLoopProps,
} from 'react-native-reanimated-hooks'
import { range } from './utils/array'
import { getLoopInterpolateRanges } from './utils/get-loop-interpolate-range'

const { interpolate } = Animated

interface BallIndicatorProps extends UseLoopProps, ViewProps {
  animating?: Animated.Value<LoopState>
  color?: string
  containerStyle?: StyleProp<ViewStyle>
  count?: number
  dotSize?: number
  easing?: Animated.EasingFunction
  interval?: number
  size?: number
}

export const BallIndicator: React.FC<BallIndicatorProps> = ({
  // animating
  animating,
  interval = 1000,
  easing,
  // dot
  color: backgroundColor = 'black',
  size = 40,
  dotSize = 10,
  count = 8,
  // container View
  containerStyle,
  // inner View
  style,
  ...viewProps
}) => {
  const animation = useLoop({ animating, interval, easing })

  const dots = useMemo<ReactNode>(() => {
    const ballStyle = {
      backgroundColor,
      bottom: size / 20,
      borderRadius: dotSize / 2,
      height: dotSize,
      width: dotSize,
    }

    return range(count).map((_, index) => {
      const angle = (index * 360) / count

      const rotate = {
        transform: [{ rotateZ: `${angle}deg` }],
      }

      const count_m1 = count - 1
      const interpolationRanges = getLoopInterpolateRanges({
        count,
        calcOutputRange: (idx) => 1.0 - (0.46 / count_m1) * ((idx + count_m1 - index) % count),
      })

      const ballAnimStyle = {
        transform: [
          {
            // @use `any` as TD is incorrect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            scale: interpolate(animation.position, interpolationRanges) as any,
          },
        ],
      }

      return (
        // eslint-disable-next-line react/no-array-index-key
        <Animated.View style={[StyleSheet.absoluteFill, rotate]} key={index}>
          <Animated.View style={[ballStyle, ballAnimStyle]} />
        </Animated.View>
      )
    })
  }, [backgroundColor, size, dotSize, count, animation.position])

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[{ width: size, height: size }, style]} {...viewProps}>
        {dots}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
