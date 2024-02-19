import React from 'react';
import history from '../../history';
import querystring from 'querystring';

function clean(str) {
	let val = str || '';

	if (val) {
		const strip = val.replace(/[^\d.]/g,'');
		const num = Number(strip);
		if (num && num === num) {
			val = num.toLocaleString();
		}
	}

	return val;
}

const SortBtn = class extends React.Component {
	state = {
		value: clean(this.props.location.query[this.props.name]),
	};

	render() {
		const {title, name, location, type} = this.props;

		return (
			<label className='ListSort_item'>
				<div>{title}</div>
				<div className='ListSort_item_field'>
					<div>{type}</div>
					<input name='filter' type='text' name={name} value={this.state.value} onInput={e => {
						this.setState({value: e.target.value});
					}} onChange={e => {
						const q = {...location.query};
						const value = Number(e.target.value.replace(/[^\d.]/g,''));

						if (value && value === value) {
							q[name] = value;
						} else {
							delete q[name];
						}

						history.push(location.pathname+'?'+querystring.stringify(q));
					}}/>
				</div>
			</label>
		);
	}
}

export default ({location}) => (
	<div className='ListSort'>
		<SortBtn title='Min Price' name='min-price' location={location} type='$'/>
		<SortBtn title='Max Price' name='max-price' location={location} type='$'/>
		<SortBtn title='Min Cap' name='min-cap' location={location} type='%'/>
		<SortBtn title='Max Cap' name='max-cap' location={location} type='%'/>
	</div>
);
