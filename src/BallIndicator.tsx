import type { ReactNode } from "react";
import { useMemo } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useLoop } from "react-native-reanimated-hooks";
import { range } from "./utils/array";
import { getLoopInterpolateRanges } from "./utils/get-loop-interpolate-range";

type BallIndicatorProps = ViewProps & {
  animating?: boolean;
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
  easing?: Animated.EasingFunction;
  /**
   * @default 1000
   */
  interval?: number;
  /**
   * size of the indicator
   * @default 52
   */
  size?: number;
};

export function BallIndicator({
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

  const balls = useMemo<ReactNode>(() => {
    const ballStyle = {
      backgroundColor,
      borderRadius: dotSize / 2,
      height: dotSize,
      width: dotSize,
    };

    return range(count).map((_, index) => {
      return <Ball key={index} style={ballStyle} value={animation.value} {...{ index, count }} />;
    });
  }, [backgroundColor, dotSize, count, animation.value]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[{ width: size, height: size }, style]} {...viewProps}>
        {balls}
      </Animated.View>
    </View>
  );
}

type BallProps = {
  style: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  index: number;
  count: number;
  value: Animated.SharedValue<number>;
};
function Ball({ style, index, count, value }: BallProps) {
  const angle = (index * 360) / count;

  const rotate = {
    transform: [{ rotateZ: `${angle}deg` }],
    alignItems: "center" as const,
  };

  const ballAnimStyle = useAnimatedStyle(() => {
    const count_m1 = count - 1;
    const interpolationRanges = getLoopInterpolateRanges({
      count,
      calcOutputRange: (idx) => 1.0 - (0.46 / count_m1) * ((idx + count_m1 - index) % count),
    });
    return {
      transform: [
        { scale: interpolate(value.value, interpolationRanges.inputRange, interpolationRanges.outputRange) },
      ],
    };
  }, [value]);
  return (
    <Animated.View style={[StyleSheet.absoluteFill, rotate]}>
      <Animated.View style={[style, ballAnimStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
