import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Login from '../Login';
import catchFocus from '../../catch-focus';

export default class extends React.Component {
	componentDidMount() {
		catchFocus(this._element);
	}
	render() {
		return (
			<div tabIndex={-1} className='Root' ref={(c)=> this._element = c}>
				<div className='Root_body'>
					<Header isUser={this.props.isUser} pathname={this.props.pathname}/>
					{this.props.children}
					<Footer/>
					<Login login={this.props.login}/>
				</div>
			</div>
		);
	}
}