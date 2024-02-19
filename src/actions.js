import store from './store';
import querystring from 'querystring';

export function updateLocation(url) {
	const a = document.createElement('a');
	a.href = url;
	const { hash, host, search, href } = a;
	const pathname = a.pathname.charAt(0) === '/' ? a.pathname : '/'+a.pathname; // IE11 omits leading slash
	const query = querystring.parse(a.search.slice(1));

	store.setState({
		location: { 
			hash, 
			host, 
			pathname,
			search, 
			query, 
			href,
		}
	});
}

export function setUser(isUser) {
	store.setState({isUser});
}

export function setAdmin(isAdmin) {
	store.setState({isAdmin});
}

export function setLogin(show, callback) {
	store.setState({
		login: { show, callback },
	});
}