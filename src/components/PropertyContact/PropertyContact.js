import React from 'react';
import request from 'arcdynamic-request';
import ResizeImg from '../ResizeImg';

export default class extends React.Component {
	_fetch = (id)=>{
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'TEAM', {
				column: [
					'FIRST_NAME',
					'LAST_NAME',
					'PHOTO',
					'EMAIL',
					'PHONE',
				],
				limit: {
					count: 1,
					offset: 0,
				},
				filter: [
					{
						code: 'ARCIMEDES_ROW_ID',
						text: id,
						type: 'exact',
					},
					{
						code: 'DELETED',
						text: 'n',
						type: 'exact',
					},
				],
				filterType: 'and',
			}],
		}, {
			expires: 1000*60*60,
		}).then(res => {
			this.setState({person: res.success && res.data.length ? res.data[0] : false});
		});
	};
	state = {
		person: null
	};
	static defaultProps = {
		size: 100,
	};
	componentDidMount() {
		this._fetch(this.props.id);
	}
	render() {
		const el = this.state.person;
		const subject = `${this.props.name} - ${this.props.city}, ${this.props.state}`;

		if (!el) return null;

		return (
			<div className='PropertyContact'>
				<ResizeImg className='PropertyContact_img' alt={`${el.FIRST_NAME} ${el.LAST_NAME}`} src={el.PHOTO} width={this.props.size} resizeWidth={this.props.size}/>
				<div className='PropertyContact_body'>
					<div className='PropertyContact_name'>{el.FIRST_NAME} {el.LAST_NAME}</div>
					<div className='PropertyContact_phone'>{el.PHONE}</div>
					<a className='PropertyContact_btn' href={`mailto:${el.EMAIL}?subject=${subject}`}>Email {el.FIRST_NAME}</a>
				</div>
			</div>
		)
	}
}