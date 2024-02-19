import React from 'react';
import Error404 from '../Error404';
import request from 'arcdynamic-request';
import Editable from '../Editable';
import { setLogin } from '../../actions';
import imgSrc from 'arcdynamic-resize';

export default class extends React.Component {
	state = {
		page: null,
	};

	_fetch = (pageCode)=>{
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'blog', {
				filter: [
					{
						text: pageCode,
						code: 'PAGECODE',
						type: 'exact',
					},
				],
				limit: {
					count: 1,
				},
			}],
		}).then((res)=>{
			this.setState({
				page: res && res.success && res.data && res.data.length ? res.data[0] : false,
			});
		});
	};
	_save = (key, content)=>{
		return request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.updateByTableCode',
			params: ['blog', {
				value: [{
					ARCIMEDES_ROW_ID: this.state.page.ARCIMEDES_ROW_ID,
					[key]: content,
				}],
			}],
		}).then(res=>{
			if (res.errorCode === 'E10P0A3') {
				setLogin(true, ()=> this._save(content, true))
			}
		});
	};
	componentWillMount() {
		this._fetch(this.props.pageCode)
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.pageCode !== nextProps.pageCode) {
			this._fetch(nextProps.pageCode);
		}
	}
	render() {
		if (this.state.page === null) return null;

		if (this.state.page === false) return <Error404/>;

		if (!this.props.isAdmin && this.state.page.PUBLISHED !== '1') return <Error404/>;

		const page = {TITLE: '', MAIN: '', ...this.state.page};

		document.title = page.TITLE;

		let formattedDate;

		if (page.DATE) {
			const date = new Date(page.DATE);
			if (date.toString() !== 'Invalid Date') {
				formattedDate = new Intl.DateTimeFormat('en-US', {
					year: 'numeric', 
					month: 'long',
					day: 'numeric',
				}).format(date);
			}
		}

		return (
			<div className='BlogPost'>
				{ formattedDate ? <div className='BlogPost_date'>{formattedDate}</div> : null }
				<h1>{page.TITLE}</h1>
				{
					page.PHOTO ? (
						<img alt='' className='BlogPost_photo' src={imgSrc(page.PHOTO.replace(arc.path.legacyMedia, arc.path.media), 1000)}/>
					) : null
				}
				<Editable content={page.MAIN} isHTML={true} enabled={this.props.isAdmin} onSave={content => this._save('MAIN', content)}/>
			</div>
		);
	}
}