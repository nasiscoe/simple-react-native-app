import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import BottomPopupCard from '../components/BottomPopupCard';
import Button from '../../../../components/atoms/Button';
import Type from '../../../../components/atoms/Type';

const GenericPopupCard = ({ toggleIsActive, updatePopupCardData, isActive, data }) => {
  const theme = useTheme().colors;

  const styles = {
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    left: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }
  };

  useEffect(() => {
    
  }, []);

  const [state, setState] = useState({
    
  });

  return (
    <BottomPopupCard isActive={isActive}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Button type='wrapper' onPress={toggleIsActive}><Type style={{fontSize: 44, paddingBottom: 5, paddingRight: 16}}>&times;</Type></Button>
          <Type type="header" style={{fontSize: 22}}>Generic</Type>
        </View>
        <Button type='rounded' textStyle={{ fontSize: 16 }} onPress={toggleIsActive}>Save</Button>
      </View>
    </BottomPopupCard>
  );
};

export default React.memo(GenericPopupCard, (prevProps, nextProps) => {
  if (prevProps.isActive === nextProps.isActive && prevProps.data === nextProps.data) {
    return true;
  }
  return false;
});
