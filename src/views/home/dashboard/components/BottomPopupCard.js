import React, { useState, useEffect } from 'react';
import { Animated, Keyboard, View, useWindowDimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import deviceInfo from '../../../../utils/deviceInfo';

const BottomPopupCard = (props) => {
  const theme = useTheme().colors;

  const screenHeight = useWindowDimensions().height;

  const getFlexBasis = () => {
    if (screenHeight < 569) {
      return { top: '37%', bottom: '63%' }
    }
    if (screenHeight < 668) {
      return { top: '34.5%', bottom: '65.5%' }
    }
    if (screenHeight < 813) {
      return { top: '29.5%', bottom: '70.5%' }
    }

    return { top: '28%', bottom: '72%' };
  }

  var modalHeight = (((parseFloat(getFlexBasis().bottom) / 100) * screenHeight) - deviceInfo.getStatusBarHeight() + 10);

  useEffect(() => {
    toggleSubview();

    Keyboard.addListener("keyboardWillShow", _keyboardWillShow);
    Keyboard.addListener("keyboardWillHide", _keyboardWillHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardWillShow", _keyboardWillShow);
      Keyboard.removeListener("keyboardWillHide", _keyboardWillHide);
    };
  }, [props.isActive]);

  const _keyboardWillShow = () => {
    if (!state.keyboardShown) {
      toggleSubview(screenHeight * 0.2);
      setState({
        ...state,
        keyboardShown: true
      });
    }
  };

  const _keyboardWillHide = () => {
    toggleSubview();
    setState({
      ...state,
      keyboardShown: false
    });
  };

  const [state, setState] = useState({
    keyboardShown: false,
    bounceValue: new Animated.Value(modalHeight + (screenHeight * 0.5)),  //This is the initial position of the subview
  });

  const styles = {
    content: {
      backgroundColor: theme.body,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      borderRadius: 30,
      padding: 24,
      paddingTop: 12,
      paddingBottom: 80,
      marginBottom: -80,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: modalHeight + (screenHeight * 0.5),
      width: '100%',
      zIndex: 2
    },
    child: {
      position: 'relative',
      width: '100%'
    }
  };

  const toggleSubview = (keyboardAvoidingHeight = 0) => {  
    var toValue = modalHeight + (screenHeight * 0.5);

    if (props.isActive) {
      toValue = (screenHeight * 0.5) - keyboardAvoidingHeight;
    }

    Animated.spring(
      state.bounceValue,
      {
        toValue: toValue,
        velocity: 15,
        tension: 75,
        friction: 10,
        useNativeDriver: true
      }
    ).start();
  }

  return (
    <Animated.View style={[styles.content, {transform: [{translateY: state.bounceValue}]}]}>
      <View style={styles.child}>
        {props.children}
      </View>
    </Animated.View>
  );
};

export default React.memo(BottomPopupCard, (prevProps, nextProps) => {
  if (prevProps.children === nextProps.children) {
    return true;
  }
  return false;
});
