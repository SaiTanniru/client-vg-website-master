import { updateLocation } from './actions';

const state = {};

export default {
	push(url) {
		window.history.pushState(state, '', url);
		updateLocation(url);
	},
	replace(url) {
		window.history.replaceState(state, '', url);
		updateLocation(url);
	}
};