import React from 'react';
import { Image, SafeAreaView, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Button from '../../components/atoms/Button';
import Type from '../../components/atoms/Type';
import { LOGO_GREEN } from '../../assets/img';

const Intro = (props) => {
  const theme = useTheme().colors;

  const styles = {
    content: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.body,
      paddingLeft: '5%',
      paddingRight: '5%',
      justifyContent: 'space-between'
    },
    header: {
      flex: 1
    },
    buttonContainer: {
      marginBottom: 20,
    }
  };

  return (
    <View style={styles.content}>
      <SafeAreaView style={{backgroundColor: theme.body, flex: 0}} />
      <SafeAreaView style={{backgroundColor: theme.body, flex: 1}}>
        <Image source={LOGO_GREEN} style={{position: 'absolute', width: '120%', height: '50%', marginLeft: 180, resizeMode: 'contain'}}></Image>
        <View style={styles.header}>
          <Type type={'h1'}>Simple React Native App</Type>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => props.navigation.navigate('NextPage')} accessibilityLabel="Click here to continue">Continue</Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Intro;
