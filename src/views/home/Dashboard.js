
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Keyboard, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../../../App';
import Button from '../../components/atoms/Button';
import Type from '../../components/atoms/Type';
import GenericPopupCard from './dashboard/bottomPopupCards/GenericPopupCard';

const Dashboard = (props) => {
  const theme = useTheme().colors;
  const authContext = React.useContext(AuthContext);

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

  const [state, setState] = useState({
    isLoading: true,
    bottomPopupCards: {
      genericPopupCard: {
        isActive: false,
        data: undefined
      }
    }
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    setState({
      ...state,
      isLoading: false
    });
  }, []);

  // Generic function to toggle the state of a popup card
  const togglePopupCard = (data, popupCardName) => {
    Keyboard.dismiss();
    if (data === undefined) {
      setState({
        ...stateRef.current,
        bottomPopupCards: {
          ...stateRef.current.bottomPopupCards,
          [popupCardName]: {
            ...eval(`stateRef.current.bottomPopupCards.${popupCardName}`),
            isActive: eval(`!stateRef.current.bottomPopupCards.${popupCardName}.isActive`)
          }
        }
      });
    } else {
      setState({
        ...stateRef.current,
        bottomPopupCards: {
          ...stateRef.current.bottomPopupCards,
          [popupCardName]: {
            ...eval(`stateRef.current.bottomPopupCards.${popupCardName}`),
            isActive: eval(`!stateRef.current.bottomPopupCards.${popupCardName}.isActive`),
            data: {
              ...eval(`stateRef.current.bottomPopupCards.${popupCardName}.data`),
              ...data
            }
          }
        }
      });
    }
  }

  // Updates the data object for a popup card
  const updatePopupCardData = (data, popupCardName) => {
    setState({
      ...stateRef.current,
      bottomPopupCards: {
        ...state.bottomPopupCards,
        [popupCardName]: {
          ...eval(`stateRef.current.bottomPopupCards.${popupCardName}`),
          data: {
            ...eval(`stateRef.current.bottomPopupCards.${popupCardName}.data`),
            ...data
          }
        }
      }
    });
  }

  const renderPopupCards = () => {
    return (
      <>
        <GenericPopupCard
          isActive={state.bottomPopupCards.genericPopupCard.isActive}
          data={state.bottomPopupCards.genericPopupCard.data}
          toggleIsActive={(data) => togglePopupCard(data, popupCardName = 'genericPopupCard')}
          updatePopupCardData={(data) => updatePopupCardData(data, popupCardName = 'genericPopupCard')}
        />
      </>
    )
  }

  return (
    <View style={styles.content}>
      {renderPopupCards()}
      <SafeAreaView style={{backgroundColor: theme.body, flex: 0}} />
      <SafeAreaView style={{backgroundColor: theme.body, flex: 1}}>
        <View style={styles.header}>
          <Type type={'h1'}>Authenticated!</Type>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => {
            authContext.signOut();
          }} accessibilityLabel="Sign out of your account">Sign Out</Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Dashboard;
