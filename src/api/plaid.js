import { Platform } from 'react-native';
import Auth from './auth';
import { REDWOOD_URL_IOS, REDWOOD_URL_ANDROID } from '../../env.json';

export default class Plaid {
  constructor() {
    this.url = Platform.OS === 'ios' ? REDWOOD_URL_IOS : REDWOOD_URL_ANDROID;
    this.auth0 = new Auth();
  }

  getLinkToken = async () => {
    const accessToken = await this.auth0.getAccessToken();
    return fetch(this.url + '/app/api/plaid/get_link_token/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }).then(response => {
      if (!response.ok) {
        console.log('response was not a 200-299 status code');
      }
      return response.json();
    });
  }

  getRelinkToken = async (itemId) => {
    const accessToken = await this.auth0.getAccessToken();
    return fetch(this.url + '/app/api/plaid/get_re_link_token/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({'db_item_id': itemId})
    }).then(response => {
      if (!response.ok) {
        console.log('response was not a 200-299 status code');
      }
      return response.json();
    });
  }

  isPlaidSyncedYet = async () => {
    const accessToken = await this.auth0.getAccessToken();
    return fetch(this.url + '/app/api/plaid/verify_cached_plaid_data/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }).then(response => {
      if (!response.ok) {
        console.log('response was not a 200-299 status code');
      }
      if (response.status === 204) {
        return true;
      }
      return false;
    });
  }

  exchangeTokens = async (publicToken, institutionId) => {
    const accessToken = await this.auth0.getAccessToken();
    return fetch(this.url + '/app/api/plaid/exchange_tokens/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ public_token: publicToken, institution_id: institutionId }),
    }).then(response => {
      if (!response.ok) {
        console.log('response was not a 200-299 status code');
      }
      return response.status;
    });
  }

  getLinkedAccounts = async () => {
    const accessToken = await this.auth0.getAccessToken();
    return fetch(this.url + '/app/api/plaid/user_items/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }).then(response => {
      if (!response.ok) {
        console.log('response was not a 200-299 status code');
      }
      return response.json();
    });
  }

  removeAccount = async (itemId) => {
    const accessToken = await this.auth0.getAccessToken();
    return fetch(this.url + '/app/api/plaid/remove_item/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({'db_item_id': itemId})
    }).then(response => {
      if (!response.ok) {
        console.log('response was not a 200-299 status code');
      }
      return response.status;
    });
  }
}
