import React from 'react';
import request from 'arcdynamic-request';
import { setAdmin, setUser, setLogin } from '../../actions';
import Alert from '../Alert';

export default class extends React.Component {
	state = {
		error: false,
		isBusy: false,
	};
	_handleSubmit = (e)=>{
		e.preventDefault();

		const username = this.n_username.value;
		const password = this.n_password.value;

		this.setState({
			error: false,
			isBusy: true,
		});

		Promise.all([
			request(arc.path.api, {
				service: 'arcimedes',
				action: 'Authentication.login',
				params: [username, password],
			}),
			request(arc.path.api, {
				service: 'arcimedes',
				action: 'open.dataquery.execute',
				params: ['PERMISSIONS_TEST'],
			}),
		]).then(values => {
			setUser(values[0].data);

			if (values[1].success) {
				if (this.props.login.callback) {
					this.props.login.callback();
				}
				setAdmin(values[1].success);
				setLogin(false);
			} else {
				this.setState({
					error: values[0].success ? 'This account has insufficient privileges for editing' : values[0].message,
					isBusy: false,
				});
			}
		});
	}
	componentDidMount() {
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'Authentication.getStatus',
		}).then(res => {
			setUser(res.data);
		});
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.dataquery.execute',
			params: ['PERMISSIONS_TEST'],
		}).then(res => {
			setAdmin(res.success);
		});
	}
	render() {
		return (
			<div className={'Login Login--'+(this.props.login.show ? 'active' : 'inactive')} aria-hidden>
				<form onSubmit={this._handleSubmit}>
					<h2>Login</h2>
					<input type='text' name='username' ref={n => this.n_username = n} placeholder='Username'/>
					<input type='password' name='password' ref={n => this.n_password = n} placeholder='Password'/>
					{
						this.state.error ? <Alert type='error'>{this.state.error}</Alert> : null
					}
					<button data-is-busy={this.state.isBusy || null}>Submit</button>
				</form>
			</div>
		);
	}
}