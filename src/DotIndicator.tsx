import type { ReactNode } from "react";
import React, { useMemo } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useLoop } from "react-native-reanimated-hooks";
import { range } from "./utils/array";
import {
  getLoopInterpolateInputRange,
  getLoopInterpolateOutputRange,
} from "./utils/get-loop-interpolate-range";

const defaultEasing = Easing.bezier(0.3, 0.01, 0.3, 0.15).factory();

type IndicatorEnableProps = {
  opacityEnabled?: boolean;
  scaleEnabled?: boolean;
};
type DotIndicatorProps = ViewProps &
  IndicatorEnableProps & {
    animating?: boolean;
    /**
     * @default 'black'
     */
    color?: string;
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * @default 3
     */
    count?: number;
    /**
     * @default 4
     */
    dotMargin?: number;
    /**
     * @default 9
     */
    dotSize?: number;
    /**
     * @default Easing.bezier(0.3, 0.01, 0.3, 0.15)
     */
    easing?: Animated.EasingFunction;
    /**
     * @default 1000
     */
    interval?: number;
  };

export function DotIndicator({
  // animating
  animating,
  interval = 1000,
  easing = defaultEasing,
  // dot
  color: backgroundColor = "black",
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
}: DotIndicatorProps) {
  const animation = useLoop({ animating, interval, easing });

  const dots = useMemo<ReactNode>(() => {
    const dotStyle = {
      backgroundColor,
      marginHorizontal: dotMargin / 2,
      borderRadius: dotSize / 2,
      height: dotSize,
      width: dotSize,
    };

    return range(count).map((_, index) => {
      const inputRange = getLoopInterpolateInputRange({ count });
      return (
        <Dot
          key={index}
          style={dotStyle}
          value={animation.value}
          {...{ index, count, inputRange, scaleEnabled, opacityEnabled }}
        />
      );
    });
  }, [backgroundColor, dotMargin, dotSize, count, scaleEnabled, opacityEnabled, animation.value]);

  return (
    <Animated.View style={[styles.container, containerStyle]} {...viewProps}>
      {dots}
    </Animated.View>
  );
}

type DotProps = {
  style: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  index: number;
  count: number;
  value: Animated.SharedValue<number>;
  scaleEnabled: boolean;
  opacityEnabled: boolean;
  inputRange: number[];
};
function Dot({ style, index, count, value, scaleEnabled, opacityEnabled, inputRange }: DotProps) {
  const animStyle = useAnimatedStyle(() => {
    const count_m1 = count - 1;

    const transform: Animated.AnimateStyle<Required<ViewStyle>>["transform"] = [];
    if (scaleEnabled)
      transform.push({
        scale: interpolate(
          value.value,
          inputRange,
          getLoopInterpolateOutputRange({
            count,
            calcRange: (idx) => 1.0 - (0.46 / count_m1) * ((count_m1 + index - idx) % count),
          }),
        ),
      });

    return {
      opacity: opacityEnabled
        ? interpolate(
            value.value,
            inputRange,
            getLoopInterpolateOutputRange({
              count,
              calcRange: (idx) => 1 - 0.55 * (((count_m1 + index - idx) % count) / count) ** 0.14,
            }),
          )
        : undefined,
      transform,
    } satisfies Animated.AnimateStyle<StyleProp<ViewStyle>>;
  }, []);

  return <Animated.View style={[style, animStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
