import React, { Component, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import {
  Animated,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import animations from '../../../constants/animations';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

const Card = ({ style, children }) => {
  const theme = useTheme().colors;
  var scaleInAnimated = useRef(new Animated.Value(0));

  const styles = {
    card: {
      flex: 1,
      backgroundColor: theme.card,
      height: 'auto',
      borderRadius: 28,
      paddingTop: 19,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10
    },
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={animations.scale.getScaleTransformationStyle(scaleInAnimated.current)}
      onPressIn={() => {
        animations.scale.pressInAnimation(scaleInAnimated.current);
        ReactNativeHapticFeedback.trigger("impactLight", options)
      }}
      onPressOut={() => {
        animations.scale.pressOutAnimation(scaleInAnimated.current);
        ReactNativeHapticFeedback.trigger("impactLight", options);
      }}>
      <Animated.View style={[styles.card, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

Card.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
}

Card.defaultProps = {
  style: {}
}

export default Card;
