import React from 'react';
import { setLogin } from '../../actions';
import history from '../../history';

export default class extends React.Component {
	componentDidMount() {
		setLogin(true, ()=> history.replace(arc.path.base));
	}
	render() {
		return <div className='LoginPage'/>;
	}
}