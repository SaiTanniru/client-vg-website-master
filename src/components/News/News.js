import React from 'react';
import request from 'arcdynamic-request';

export default class extends React.Component {
	_fetch = ()=>{
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'NEWS', {
				column: [
					'TITLE',
					'URL',
					'SOURCE_NAME',
					'SOURCE_URL',
					'DATE',
					'ARCIMEDES_ROW_ID',
				],
				filter: [
					{
						code: 'DATE',
						text: '',
						type: 'notNull',
					},
				],
				limit: {
					count: 999,
					offset: 0,
				},
			}],
		}, {
			expires: 1000*60*60,
		}).then(res => {
			const arr = res.data || [];
			const data = {};

			arr.forEach(el => {
				if (!el.DATE) return;

				const date = new Date(el.DATE);
				const y = date.getUTCFullYear();

				if (!data[y]) {
					data[y] = [];
				}

				data[y].push({...el, timeStamp: date.getTime()});
			});

			let active;

			const recentYear = Object.keys(data).sort((a,b)=> b-a)[0];
			if (recentYear) {
				active = data[recentYear];
			}

			Object.keys(data).forEach(year => {
				data[year].sort((a,b)=> b.timeStamp - a.timeStamp);
			});

			this.setState({
				data,
				active,
				isFetching: false,
			});
		}); // todo caching
	}
	state = {
		data: null,
		active: null,
		isFetching: true,
	};
	componentDidMount() {
		this._fetch();
	}
	render() {
		const { data, active, isFetching } = this.state;

		return (
			<div className='News'>
				<div className='News_body'>
					<div className='News_body_tabs'>
					{
						isFetching ? (
							[...Array(2)].map((el,i) => <button key={i} className={'News_body_tabs_btn'}>{'\u00A0'}</button>)
						) : Object.keys(data).sort((a,b)=> b-a).slice(0,5).map(year => {
							return (
								<button key={year} className={'News_body_tabs_btn'+(active === data[year] ? ' News_body_tabs_btn--active' : '')} onClick={()=> this.setState({active: data[year]})}>
									{year}
								</button>
							)
						})
					}
					</div>
					<div className='News_body_panel'>
						<h3>In The News</h3>
						<ul>
						{
							!isFetching ? active.map(el => (
								<li key={el.ARCIMEDES_ROW_ID}>
									<a href={el.URL} target='_blank' rel='noopener'>{el.TITLE}</a> { el.SOURCE_NAME ? <span>{el.SOURCE_NAME}</span> : null}
								</li>
							)) : null
						}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}