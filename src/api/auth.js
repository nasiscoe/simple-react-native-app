import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import { AUTH_URL, AUTH_AUDIENCE, AUTH_CLIENT_ID } from '../../env.json';

export default class Auth {
  constructor() {
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.refreshAuthentication = this.refreshAuthentication.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.sendCodeToPhoneNumber = this.sendCodeToPhoneNumber.bind(this);
    this.authenticatePhoneNumberWithCode = this.authenticatePhoneNumberWithCode.bind(this);
    this.resetAuthentication = this.resetAuthentication.bind(this);
  }

  isAuthenticated = async () => {
    return RNSecureKeyStore.get("expires")
      .then((expires) => {
        if (expires === undefined) {
          return false;
        }
        if (new Date(parseInt(expires)) <= new Date()) {
          return false;
        } else {
          return true;
        }
      }, (err) => {
        return false;
      });
  }

  refreshAuthentication = async () => {
    return RNSecureKeyStore.get("refreshToken")
      .then((res) => {
        const refreshToken = res;
        if (refreshToken === undefined) {
          return null;
        }
        return fetch(AUTH_URL + '/oauth/token', {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {'Content-Type': 'application/json'},
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({
            grant_type: 'refresh_token',
            client_id: AUTH_CLIENT_ID,
            refresh_token: refreshToken
          })
        }).then(res => res.json()).then(async response => {
          await RNSecureKeyStore.set("accessToken", response.access_token, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
          const expires = (Date.now() + response.expires_in).toString();
          await RNSecureKeyStore.set("expires", expires, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
          return response;
        });
      }, (err) => {
        return err;
      });
  }

  getAccessToken = async () => {
    const isAuthenticated = await this.isAuthenticated();
    if (isAuthenticated) {
      return RNSecureKeyStore.get("accessToken")
        .then((accessToken) => {
          return accessToken;
        }, (err) => {
          return null;
        });
    } else {
      const response = await this.refreshAuthentication();
      // If user has never authenticated (or authentication needs to be redone), return null
      if (response === null) {
        return null;
      } else {
        return response.access_token;
      }
    }
  }

  sendCodeToPhoneNumber = async (phoneNumber) => {
    const response = await fetch(AUTH_URL + '/passwordless/start', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        client_id: AUTH_CLIENT_ID,
        connection: 'sms',
        phone_number: phoneNumber,
        send: 'code'
      })
    });
    return response.json();
  }

  authenticatePhoneNumberWithCode = async (phoneNumber, code) => {
    return fetch(AUTH_URL + '/oauth/token', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
        client_id: AUTH_CLIENT_ID,
        username: phoneNumber,
        otp: code.toString(),
        realm: 'sms',
        audience: AUTH_AUDIENCE,
        scope: 'openid profile offline_access'
      })
    }).then(res => res.json()).then(async response => {
      await RNSecureKeyStore.set("refreshToken", response.refresh_token, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
      await RNSecureKeyStore.set("accessToken", response.access_token, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
      /* Subtract 2000 milliseconds to mitigate a scenario where we think
      / the access token is valid (not expired) but it expires in
      / the short window of time that it takes for us to actually use it */
      const expires = (parseInt(Date.now()) + parseInt(response.expires_in) - 2000).toString();
      await RNSecureKeyStore.set("expires", expires, {accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY});
      return response;
    });
  }

  // Sign out
  resetAuthentication = async () => {
    try {
      await RNSecureKeyStore.remove("accessToken");
      await RNSecureKeyStore.remove("refreshToken");
      await RNSecureKeyStore.remove("expires");
      return true;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}
