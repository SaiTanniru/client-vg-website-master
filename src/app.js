import ReactDOM from 'react-dom';
import routes from './routes';
import history from './history';
import localLink from 'local-link';
import store from './store';
import Router from 'bare-router';
import { updateLocation } from './actions';

const router = Router(routes);

// Render Cycle
{
	const container = document.createElement('div');

	document.body.appendChild(container);

	function render(state) {
		const { handler, params } = router(state.location.pathname);

		if (handler) {
			const component = handler(params, state);
			ReactDOM.render(component, container, container.children[0]);
		} else {
			container.textContent = 'Route not found';
		}
	}
	
	store.subscribe((state)=> {
		render(state);
	});
}

// SPA Navigation
{
	// Intercept anchor clicks
	window.addEventListener('click', (e) => {
		const anchor = localLink(e);

		if (!anchor) return;

		const { handler } = router(anchor.pathname);

		if (handler) {
			const current = store.getState().location;
			
			let top = false;

			if (anchor.pathname !== current.pathname || anchor.search !== current.search || !anchor.hash) {
				e.preventDefault();
				top = true;
			}

			history.push(anchor.href);

			if (top) {
				window.scrollTo(0, 0);
			}
		}
	});

	// Catch back/forward buttons
	window.addEventListener('popstate', ()=> {
		updateLocation(window.location);
	});
}

// Init
updateLocation(window.location);
