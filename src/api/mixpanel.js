import Auth from './auth';
import Redwood from './redwood';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import strings from '../utils/strings';
import { IS_PROD, MIXPANEL_TOKEN } from '../../env.json';

import Mixpanel from 'react-native-mixpanel';

export default class MixpanelTracking {
  constructor() {
    this.auth0 = new Auth();
    this.redwood = new Redwood();
    Mixpanel.sharedInstanceWithToken(MIXPANEL_TOKEN);
    this.setProperty = this.setProperty.bind(this);
  }

  refreshTracking = () => {
    if (IS_PROD) {
      this.redwood.getUUID().then(response => {
        Mixpanel.identify(response.user_uuid_identifier);
      });
    }
  }

  createTrackedUser = async (phoneNumber) => {
    if (IS_PROD) {
      this.redwood.getUUID().then(response => {
        Mixpanel.createAlias(response.user_uuid_identifier);
        if (phoneNumber) {
          this.setProperty({"Phone Number": phoneNumber});
        }
        Mixpanel.identify(response.user_uuid_identifier);
      });
    }
  }

  setProperty = (obj) => {
    if (IS_PROD) {
      Mixpanel.set(obj);
    }
  }

  startTrackTimer = (name) => {
    if (IS_PROD) {
      Mixpanel.timeEvent(name);
    }
  }

  track = (name, data) => {
    if (IS_PROD) {
      if (data !== undefined && data !== null) {
        Mixpanel.trackWithProperties(name, data);
      } else {
        Mixpanel.track(name);
      }
    }
  }

  incrementTrackedProperty = (name, amount = 1) => {
    if (IS_PROD) {
      Mixpanel.increment(name, amount);
    }
  }
}
