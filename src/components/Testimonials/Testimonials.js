import React from 'react';
import request from 'arcdynamic-request';
import ResizeImg from '../ResizeImg';
import TestimonialsSlider from '../TestimonialsSlider';

export default class extends React.Component {
	_fetch = ()=>{
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'TESTIMONIALS', {
				column: ['NAME', 'TITLE', 'COMPANY', 'QUOTE', 'PHOTO', 'ARCIMEDES_ROW_ID'],
				limit: {
					count: 100,
					offset: 0,
				},
			}],
		}, {
			expires: 1000*60*60,
		}).then(res => {
			this.setState({
				data: res.data || [],
				isFetching: false,
			});
		}); // todo caching
	}
	state = {
		data: null,
		isFetching: true,
	};
	componentDidMount() {
		this._fetch();
	}
	render() {
		const { data, isFetching } = this.state;

		if (isFetching) return null;

		const slides = data.map(el => (
			<div key={el.ARCIMEDES_ROW_ID} className='Testimonials_item'>
				{
					el.PHOTO ? (
						<div className='Testimonials_item_photo'>
							<ResizeImg src={el.PHOTO} alt={el.NAME} width={165} resizeWidth={165}/>
						</div>
					) : null
				}
				<div className='Testimonials_item_body'>
					<blockquote>
						"{el.QUOTE}"
					</blockquote>
					<footer>
						<div><b>{el.NAME}</b></div>
						<div>{el.TITLE ? el.TITLE : null}{el.TITLE && el.COMPANY ? ' – ' : null}{el.COMPANY ? el.COMPANY : null}</div>
					</footer>
				</div>
			</div>
		));

		return (
			<div className='Testimonials'>
				<div className='Testimonials_wrap'>
					<TestimonialsSlider slides={slides}/>
				</div>
			</div>
		);
	}
}