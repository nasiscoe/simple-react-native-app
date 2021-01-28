import React, { PureComponent } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import { useTheme } from '@react-navigation/native';

const getOutputRange = (width, isReversed) => isReversed ? [width, -width] : [-width, width]

class ShimmerPlaceholder extends PureComponent {
  state = {
    beginShimmerPosition: new Animated.Value(-1)
  }
  getAnimated = () => {
    const { delay, duration, isInteraction } = this.props
    return Animated.loop(Animated.timing(this.state.beginShimmerPosition, {
      toValue: 1,
      delay,
      duration,
      useNativeDriver: true,
      isInteraction
    }))
  }
  animatedValue = this.getAnimated()

  render() {
    return (
      <BasedShimmerPlaceholder {...this.props} animatedValue={this.animatedValue} beginShimmerPosition={this.state.beginShimmerPosition} />
    )
  }
}

ShimmerPlaceholder.defaultProps = {
  delay: 0,
  duration: 1000,
  isInteraction: true
}

const BasedShimmerPlaceholder = (props) => {
  const theme = useTheme().colors;

  const {
    width = 200,
    height = 15,
    duration = 1000,
    delay = 0,
    shimmerColors = theme.shimmer,
    isReversed = false,
    stopAutoRun = false,
    visible,
    location = [0.3, 0.5, 0.7],
    style,
    contentStyle,
    shimmerStyle,
    isInteraction = true,
    LinearGradient = global.Expo
      ? global.Expo.LinearGradient
      : View,
    children,
    animatedValue,
    beginShimmerPosition,
    shimmerWidthPercent = 1,
  } = props

  const linearTranslate = beginShimmerPosition.interpolate({
    inputRange: [-1, 1],
    outputRange: getOutputRange(width, isReversed)
  });

  React.useEffect(() => {
    if (!stopAutoRun) {
      animatedValue.start()
    }
    return () => {
      animatedValue.stop()
    }
  }, [stopAutoRun])

  React.useEffect(() => {
    if (visible) {
      animatedValue.stop()
    }
    if (!visible && !stopAutoRun) {
      animatedValue.start()
    }
  }, [visible, stopAutoRun])

  return (
    <View
      style={[!visible && { height, width }, styles.container, !visible && shimmerStyle, style]}
    >
      {/* Force render children to restrict rendering twice */}
      <View style={[!visible && { width: 0, height: 0, opacity: 0 }, visible && contentStyle]}>{children}</View>
      {
        !visible && (
          <View style={{ flex: 1, backgroundColor: shimmerColors[0] }}>
            <Animated.View
              style={{ flex: 1, transform: [{ translateX: linearTranslate }] }}
            >
              <LinearGradient
                colors={shimmerColors}
                style={{ flex: 1, width: width * shimmerWidthPercent }}
                start={{
                  x: -1,
                  y: 0.5
                }}
                end={{
                  x: 2,
                  y: 0.5
                }}
                locations={location}
              />
            </Animated.View>

          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden"
  },

});

/**
 * To create ShimmerPlaceholder by Linear Gradient. Only useful when you use 3rd party,
 * For example: react-native-linear-gradient
 * @param {Linear Gradient Component} LinearGradient - 'expo-linear-gradient' by default
 *
 * @example
 *
 * import LinearGradient from 'react-native-linear-gradient';
 * import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
 *
 * const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient)
 *
 * ...
 *
 * <ShimmerPlaceHolder />
 */
export const createShimmerPlaceholder = (LinearGradient = global.Expo
  ? global.Expo.LinearGradient
  : View) => React.forwardRef((props, ref) => <ShimmerPlaceholder LinearGradient={LinearGradient} ref={ref} {...props} />)

export default ShimmerPlaceholder