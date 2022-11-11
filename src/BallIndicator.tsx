import type { ReactNode } from "react";
import React, { useMemo } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import Animated, { EasingNode as Easing, interpolateNode as interpolate } from "react-native-reanimated";
import type { ReanimatedLoopState as LoopState, UseLoopOptions } from "react-native-reanimated-hooks";
import { useLoop } from "react-native-reanimated-hooks";
import { range } from "./utils/array";
import { getLoopInterpolateRanges } from "./utils/get-loop-interpolate-range";

interface BallIndicatorProps extends UseLoopOptions, ViewProps {
  animating?: Animated.Value<LoopState>;
  /**
   * @default 'black'
   */
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * @default 8
   */
  count?: number;
  /**
   * @default 10
   */
  dotSize?: number;
  /**
   * @default Easing.linear
   */
  easing?: Animated.EasingNodeFunction;
  /**
   * @default 1000
   */
  interval?: number;
  /**
   * size of the indicator
   * @default 52
   */
  size?: number;
}

export function BallIndicator({
  // animating
  animating,
  interval = 1000,
  easing = Easing.linear,
  // dot
  color: backgroundColor = "black",
  size = 52,
  dotSize = 10,
  count = 8,
  // container View
  containerStyle,
  // inner View
  style,
  ...viewProps
}: BallIndicatorProps) {
  const animation = useLoop({ animating, interval, easing });

  const dots = useMemo<ReactNode>(() => {
    const ballStyle = {
      backgroundColor,
      borderRadius: dotSize / 2,
      height: dotSize,
      width: dotSize,
    };

    return range(count).map((_, index) => {
      const angle = (index * 360) / count;

      const rotate = {
        transform: [{ rotateZ: `${angle}deg` }],
        alignItems: "center" as const,
      };

      const count_m1 = count - 1;
      const interpolationRanges = getLoopInterpolateRanges({
        count,
        calcOutputRange: (idx) => 1.0 - (0.46 / count_m1) * ((idx + count_m1 - index) % count),
      });

      const ballAnimStyle = {
        transform: [{ scale: interpolate(animation.position, interpolationRanges) }],
      };

      return (
        <Animated.View style={[StyleSheet.absoluteFill, rotate]} key={index}>
          <Animated.View style={[ballStyle, ballAnimStyle]} />
        </Animated.View>
      );
    });
  }, [backgroundColor, dotSize, count, animation.position]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[{ width: size, height: size }, style]} {...viewProps}>
        {dots}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
