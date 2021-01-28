import React, { Component, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import {
  Animated,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import animations from '../../../constants/animations';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

const Button = ({ buttonStyle, textStyle, accessibilityLabel, children, disabled, isSelected, onPress, type }) => {
  const theme = useTheme().colors;
  var scaleInAnimated = useRef(new Animated.Value(0));

  const getTypeSpecificStyles = () => {
    switch(type) {
      case 'primary':
        return {
          buttonBackgroundColor: theme.text,
          buttonBorderRadius: 20,
          textColor: theme.body,
          paddingTop: 13,
          paddingBottom: 14,
          paddingLeft: 24,
          paddingRight: 24
        }
      case 'rounded':
        return {
          buttonBackgroundColor: theme.secondaryAccent,
          buttonBorderRadius: 100,
          textColor: theme.secondary,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 24,
          paddingRight: 24
        }
      case 'tab':
        if (isSelected) {
          return {
            buttonBackgroundColor: 'transparent',
            buttonBorderRadius: 20,
            textColor: theme.text,
            paddingTop: 13,
            paddingBottom: 14,
            paddingLeft: 24,
            paddingRight: 24
          }
        } else {
          return {
            buttonBackgroundColor: 'transparent',
            buttonBorderRadius: 20,
            textColor: theme.border,
            paddingTop: 13,
            paddingBottom: 14,
            paddingLeft: 24,
            paddingRight: 24
          }
        }
      case 'text':
        return {
          buttonBackgroundColor: 'transparent',
          buttonBorderRadius: 0,
          textColor: theme.text,
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 8,
          paddingRight: 8,
        }
      case 'wrapper':
        return {
          buttonBackgroundColor: 'transparent',
          buttonBorderRadius: 0,
          textColor: 'transparent',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }
      default:
        return {
          buttonBackgroundColor: theme.text,
          buttonBorderRadius: 20,
          textColor: theme.body,
          paddingTop: 13,
          paddingBottom: 14,
          paddingLeft: 24,
          paddingRight: 24
        }
    }
  };

  const styles = {
    button: {
      backgroundColor: getTypeSpecificStyles().buttonBackgroundColor,
      width: 'auto',
      height: 'auto',
      borderRadius: getTypeSpecificStyles().buttonBorderRadius,
      paddingTop: getTypeSpecificStyles().paddingTop,
      paddingBottom: getTypeSpecificStyles().paddingBottom,
      paddingLeft: getTypeSpecificStyles().paddingLeft,
      paddingRight: getTypeSpecificStyles().paddingRight,
      opacity: disabled ? 0.3 : 1
    },
    text: {
      color: getTypeSpecificStyles().textColor,
      fontSize: 20,
      textAlign: 'center',
      opacity: disabled ? 0.6 : 1
    },
  };

  if (type === 'wrapper') {
    return (
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={1}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        underlayColor={'transparent'}
        style={animations.scale.getScaleTransformationStyle(scaleInAnimated.current)}
        onPressIn={() => {
          animations.scale.pressInAnimation(scaleInAnimated.current);
          ReactNativeHapticFeedback.trigger("impactLight", options);
        }}
        onPressOut={() => {
          animations.scale.pressOutAnimation(scaleInAnimated.current);
          ReactNativeHapticFeedback.trigger("impactLight", options);
        }}>
        <Animated.View style={[styles.button, buttonStyle]}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={1}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        underlayColor={'transparent'}
        style={animations.scale.getScaleTransformationStyle(scaleInAnimated.current)}
        onPressIn={() => {
          animations.scale.pressInAnimation(scaleInAnimated.current);
          ReactNativeHapticFeedback.trigger("impactLight", options);
        }}
        onPressOut={() => {animations.scale.pressOutAnimation(scaleInAnimated.current);}}>
        <Animated.View style={[styles.button, buttonStyle]}>
          <Text style={[styles.text, textStyle]}>
            {children}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]).isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
  isSelected: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
  buttonStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array])
}

Button.defaultProps = {
  onPress: () => {},
  type: 'primary',
  isSelected: true,
  accessibilityLabel: 'Button',
  buttonStyle: {},
  textStyle: {}
}

export default Button;
