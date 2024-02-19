import React from 'react';
import ListSort from '../ListSort';
import history from '../../history';
import querystring from 'querystring';

const links = [
	{
		title: 'Single-Tenant',
		pathname: arc.path.base+'listings/single-tenant'
	},
	{
		title: 'Multi-Tenant',
		pathname: arc.path.base+'listings/multi-tenant'
	},
	{
		title: 'Transaction History',
		pathname: arc.path.base+'listings/history'
	},
];

export default class extends React.Component {
	state = {
		isOpen: Object.keys(this.props.location.query).length ? true : false,
	};
	render() {
		const { location, mode } = this.props;

		return (
			<div className='ListingsHead'>
				<div className='ListingsHead_title'>Listings</div>
				{
					this.state.isOpen ? (
						<form onSubmit={e => e.preventDefault()}>
							<nav className='ListingsHead_nav'>
								{
									links.map((el,i) => {
										const q = {...location.query};
										q.map = 1;
										let qsMap = querystring.stringify(q);
										delete q.map;
										let qs = querystring.stringify(q);

										return (
											<div key={i} className='ListingsHead_nav_item'>
												<div key={i} className='ListingsHead_nav_item_input'>
													<input type='checkbox' name='type' checked={location.pathname === el.pathname} onClick={e => {
														if (e.target.checked) {
															history.push(el.pathname+(qs?('?'+qs):''));
														} else {
															history.push('/listings'+(qs?('?'+qs):''));
														}
													}}/>
												</div>
												<div key={i} className='ListingsHead_nav_item_body'>
													<a className={'ListingsHead_nav_item_link' + (location.pathname === el.pathname ? ' is-active' : '')} href={(location.pathname === el.pathname && !location.query.map ? '/listings' : el.pathname)+(qs?('?'+qs):'')}>{el.title}</a>
													<a className={'ListingsHead_nav_item_map'} href={(location.pathname === el.pathname && location.query.map ? '/listings' : el.pathname)+(qsMap?('?'+qsMap):'')}>view map</a>
												</div>
											</div>
										)
									})
								}
							</nav>
							{
								mode !== 'history' && <ListSort location={location}/>
							}
						</form>
					) : (
						<div className='ListingsHead_toggle'>
							<button type='button' className='ListingsHead_toggle_btn' onClick={() => this.setState({isOpen: true})}>Filter By +</button>
						</div>
					)
				}
			</div>
		);
	}
}
