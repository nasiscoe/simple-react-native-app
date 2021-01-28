import { Keyboard } from 'react-native';

const dismissKeyboard = () => {
	Keyboard.dismiss();
	return false;
}

module.exports = {
  dismissKeyboard
};