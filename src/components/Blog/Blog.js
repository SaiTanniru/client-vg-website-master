import React from 'react';
import Error404 from '../Error404';
import request from 'arcdynamic-request';
import imgSrc from 'arcdynamic-resize';

export default class extends React.Component {
	state = {
		posts: null,
	};

	_fetch = (pageCode, isAdmin)=>{
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'blog', {
				column: [
					'ARCIMEDES_ROW_ID',
					'DATE',
					'TITLE',
					'PHOTO',
					'PAGECODE',
				],
				filter: [
					{
						code: 'PUBLISHED',
						text: '1',
						type: 'exact',
					},
				],
				order: [
					{
						code: 'DATE',
						type: 'desc',
					},
				],
				limit: {
					count: 10,
				},
			}],
		}, {
			expires: isAdmin ? false : 1000*60*60,
		}).then((res)=>{
			this.setState({
				posts: res && res.success && res.data || false,
			});
		});
	};

	componentWillMount() {
		this._fetch(this.props.pageCode, this.props.isAdmin)
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.pageCode !== nextProps.pageCode) {
			this._fetch(nextProps.pageCode, nextProps.isAdmin);
		}
	}

	render() {
		const { posts } = this.state;

		if (posts === null) return null;

		if (posts === false) return <Error404/>;

		return (
			<div className='Blog'>
				<div className='Blog_list'>
					{
						posts.map(el => {
							let formattedDate;

							if (el.DATE) {
								const date = new Date(el.DATE);
								if (date.toString() !== 'Invalid Date') {
									formattedDate = new Intl.DateTimeFormat('en-US', {
										year: 'numeric', 
										month: 'long',
										day: 'numeric',
									}).format(date);
								}
							}

							return (
								<a className='Blog_list_post' href={`/blog/${el.PAGECODE}`}>
									{
										el.PHOTO ? (
											<span className='Blog_list_post_img' style={{backgroundImage: `url("${imgSrc(el.PHOTO.replace(arc.path.legacyMedia, arc.path.media), 600)}")`}}/>
										) : null
									}
									{
										formattedDate ? (
											<span className='Blog_list_post_date'>{formattedDate}</span>
										) : null
									}
									<span className='Blog_list_post_title'>{el.TITLE}</span>
								</a>
							);
						})
					}
					<div className='Blog_list_spacer'/>
					<div className='Blog_list_spacer'/>
					<div className='Blog_list_spacer'/>
					<div className='Blog_list_spacer'/>
					<div className='Blog_list_spacer'/>
				</div>
			</div>
		);
	}
}