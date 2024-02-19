import React from 'react';
import request from 'arcdynamic-request';
import marked from 'marked';

function slug(text) {
	return text.toString().toLowerCase().trim()
		.replace(/\s+/g, '-')    // Replace spaces with -
		.replace(/&/g, '-and-')  // Replace & with 'and'
		.replace(/[^\w-]+/g, '') // Remove all non-word chars
		.replace(/--+/g, '-');   // Replace multiple - with single -
}

export default class extends React.Component {
	_fetchList = ()=>{
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'Events', {
				column: [
					'TITLE',
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
				order: [
					{
						code: 'DATE',
						type: 'desc',
					}
				],
				limit: {
					count: 999,
					offset: 0,
				},
			}],
		}, {
			expires: 1000*60*60,
		}).then(res => {
			this.setState({
				list: res.data,
			});
		});
	}
	_fetchEvent = (id)=>{
		this.setState({
			isFetching: true,
		});

		const params = {
			column: [
				'TITLE',
				'TEXT',
				'DATE',
				'ARCIMEDES_ROW_ID',
			],
			order: [
				{
					code: 'DATE',
					type: 'desc',
				}
			],
			limit: {
				count: 1,
				offset: 0,
			},
		};

		if (id) {
			params.filter = [{
				code: 'ARCIMEDES_ROW_ID',
				text: id,
				type: 'exact',
			}]
		}

		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'Events', params],
		}, {
			expires: 1000*60*60,
		}).then(res => {
			this.setState({
				event: res.data && res.data[0] ? res.data[0] : false,
			})
		});
	}
	state = {
		event: null,
		list: null,
	};
	componentDidMount() {
		this._fetchEvent(this.props.id);
		this._fetchList();
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			this._fetchEvent(nextProps.id);
		}
	}
	render() {
		const { list, event } = this.state;

		return (
			<div className='Events'>
				<div className='Events_body'>
					<div className='Events_body_tabs'>
					{
						list ? list.map(el => (
							<a key={el.ARCIMEDES_ROW_ID} href={arc.path.base+'events/'+el.ARCIMEDES_ROW_ID+'/'+slug(el.TITLE)} className={'Events_body_tabs_btn'+(el.ARCIMEDES_ROW_ID === event.ARCIMEDES_ROW_ID ? ' Events_body_tabs_btn--active' : '')}>
								{el.TITLE}
							</a>
						)) : null
					}
					</div>
					<div className='Events_body_panel'>
						{
							event ? (
								<div>
									<h1>{event.TITLE}</h1>
									<div dangerouslySetInnerHTML={{__html: marked(event.TEXT)}}/>
								</div>
							) : null
						}
					</div>
				</div>
			</div>
		);
	}
}