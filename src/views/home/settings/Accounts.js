import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Alert, View, useWindowDimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import HDText from '../../../components/atoms/Text';
import Button from '../../../components/atoms/Button';
import Card from '../../../components/atoms/Card';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from '../../../components/atoms/Shimmer';
import Plaid from '../../../api/plaid';
import calendarUtil from '../../../utils/calendar';
import { AuthContext } from '../../../../App';

const plaid = new Plaid();

const Accounts = (props) => {
  const theme = useTheme().colors;
  const authContext = React.useContext(AuthContext);

  const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
  const screenWidth = useWindowDimensions().width;
  const shimmerCardWidth = screenWidth * .9;

  const [state, setState] = useState({
    accounts: [],
    isLoading: true,
    showAccountDetails: undefined
  });

  useLayoutEffect(() => {
    plaid.getLinkedAccounts().then(response => {
      setState({
        ...state,
        userId: response.user_id,
        accounts: response.linked_items,
        isLoading: false
      });
    }).catch(err => {
      console.log(err);
      setState({
        ...state,
        isLoading: false
      });
    });
  }, []);

  const styles = {
    account: {
      marginTop: 2,
      marginBottom: 5
    },
    accounts: {
      marginTop: 12
    },
    divider: {
      marginTop: 8,
      borderBottomWidth: 1.5,
      borderBottomColor: theme.border
    },
    cardContent: {
      backgroundColor: theme.card,
      borderRadius: 24,
      height: 'auto',
      width: 'auto',
      padding: 15
    },
    flexRow: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch'
    },
    label: {
      fontFamily: 'Barlow',
      color: theme.text,
      fontSize: 14
    },
    labelRight: {
      textAlign: 'right'
    },
    accountInfo: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    caret: {
      color: theme.text,
      fontSize: 26,
      fontWeight: '900',
      zIndex: 1,
      marginTop: -3
    },
    info: {
      fontFamily: 'Barlow',
      color: theme.text,
      fontSize: 16,
      fontWeight: '900'
    },
    noAccounts: {
      paddingTop: 16,
      paddingBottom: 8,
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    noAccountsText: {
      fontFamily: 'Barlow',
      fontSize: 12,
      color: theme.text
    }
  };

  const linkNewPlaid = () => {
    props.navigation.navigate('PlaidLinkAccounts', { cancellable: true });
  }

  const relinkPlaid = (account) => {
    props.navigation.navigate('PlaidRelinkAccounts', { itemName: account?.ins_name, itemId: account?.db_item_id });
  }

  const confirmDeletion = (account) => {
    Alert.alert(
      `Delete ${account.ins_name}?`,
      "This action cannot be undone",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {text: "Confirm", onPress: () => {
          plaid.removeAccount(account.db_item_id).then(response => {
            authContext.refreshAuthentication();
          });
        }}
      ],
      { cancelable: false }
      );
  }

  const toggleShowAccountDetails = (institutionId) => {
    if (state.showAccountDetails !== undefined) {
      setState({
        ...state,
        showAccountDetails: undefined
      });
    } else {
      setState({
        ...state,
        showAccountDetails: institutionId
      });
    }
  }

  const renderLoadingState = () => {
    return (
      <View style={{ width: '100%' }}>
        <ShimmerPlaceHolder
          width={shimmerCardWidth}
          height={40}
          style={{ marginTop: 15 }}
          shimmerStyle={[{ borderRadius: 20 }]}
          visible={false}
        />
      </View>
    )
  }

  const renderAccount = (account, index) => {
    return (
      <View key={`${account.name}-${account.ins_id}`} style={styles.account}>
        <View style={styles.flexRow}>
          <View style={styles.accountInfo}>
            <HDText type={'text'} style={{ width: 0 }}>-</HDText>
            <HDText type={'subheader'} numberOfLines={1}>{account?.ins_name}</HDText>
          </View>
          <View style={{alignSelf: 'stretch'}}>
            <Button type="wrapper" onPress={() => toggleShowAccountDetails(account.ins_id)}>
              {account?.relink === false ?
                (state.showAccountDetails === account.ins_id ?
                  <View style={styles.actionButtons}>
                    <Button type={'rounded'} buttonStyle={{backgroundColor: theme.border, opacity: 0.4, marginRight: 5 }} textStyle={{ fontSize: 16, color: theme.text }} onPress={() => toggleShowAccountDetails(account.ins_id)}>Cancel</Button>
                    <Button type={'rounded'} buttonStyle={{backgroundColor: theme.danger}} textStyle={{ fontSize: 16, color: theme.red }} onPress={() => confirmDeletion(account)}>Remove</Button>
                  </View>
                  :
                  <View style={styles.actionButtons}>
                    <HDText type={'value'} style={[styles.labelRight, { color: theme.text, marginRight: 10 }]}>Connected</HDText>
                    <HDText style={styles.caret}>&#8250;</HDText>
                  </View>
                )
                :
                (state.showAccountDetails === account.ins_id ?
                  <View style={styles.actionButtons}>
                    <Button type={'rounded'} buttonStyle={{backgroundColor: theme.danger, marginRight: 5 }} textStyle={{ fontSize: 16, color: theme.red }} onPress={() => confirmDeletion(account)}>Remove</Button>
                    <Button type={'rounded'} textStyle={{ fontSize: 16}} onPress={() => relinkPlaid(account)}>Reconnect</Button>
                  </View>
                  :
                  <View style={styles.actionButtons}>
                    <HDText type={'value'} style={[styles.labelRight, { color: theme.red, marginRight: 10 }]}>Disconnected</HDText>
                    <HDText style={[styles.caret, {color: theme.red}]}>&#8250;</HDText>
                  </View>
                )
              }
              </Button>
            </View>
        </View>
        {index !== state.accounts.length - 1 ?
          <View style={styles.divider} />
          :
          null
        }
      </View>
    );
  }

  return (
    <View>
      <View style={styles.flexRow}>
        <View>
          <HDText type={'header'}>Accounts</HDText>
        </View>
        {state.accounts?.length !== 0 ?
          <Button type={'rounded'} textStyle={{ fontSize: 16 }} onPress={() => linkNewPlaid()}>Add</Button>
          :
          null
        }
      </View>
      {state.isLoading ?
        renderLoadingState()
        :
        (state.accounts?.length !== 0 ?
          <View style={styles.accounts}>
            {state.accounts?.map((account, index) =>
              renderAccount(account, index)
            )}
          </View>
          :
          <View style={styles.noAccounts}>
            <HDText type={'text'}>You don't have any bank accounts or credit cards linked to Heyday.</HDText>
          </View>
        )
      }
    </View>
  );
};

export default Accounts;