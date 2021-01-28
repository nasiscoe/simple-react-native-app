import React, { Component, useRef } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';

const Type = ({ children, numberOfLines, style, type }) => {
  const theme = useTheme().colors;

  const getTypeSpecificStyles = () => {
    switch (type) {
      case 'h1':
        return {
          color: theme.text,
          fontSize: 34
        }
      case 'header':
        return {
          color: theme.text,
          fontSize: 17
        }
      case 'subheader':
        return {
          color: theme.accent,
          fontSize: 16
        }
      case 'value':
        return {
          color: theme.text,
          fontSize: 16
        }
      case 'largeValue':
        return {
          color: theme.text,
          fontSize: 20
        }
      case 'text':
        return {
          color: theme.text,
          fontSize: 15
        }
      default:
        return {
          color: theme.text,
          fontSize: 15
        }
    }
  };

  const styles = {
    text: {
      fontFamily: getTypeSpecificStyles().fontFamily,
      flexWrap: 'wrap',
      color: getTypeSpecificStyles().color,
      fontSize: getTypeSpecificStyles().fontSize
    },
  };

  if (type === 'h1') {
    return (
      <Text style={[styles.text, style, { marginTop: '5%' }]} numberOfLines={numberOfLines}>
        {children}
      </Text>
    );
  } else {
    return (
      <Text style={[styles.text, style]} numberOfLines={numberOfLines}>
        {children}
      </Text>
    );
  }
}

Type.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]).isRequired,
  numberOfLines: PropTypes.number,
  type: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array])
}

Type.defaultProps = {
  type: 'text',
  numberOfLines: undefined,
}

export default Type;
