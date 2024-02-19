import React from 'react';
import Error404 from '../Error404';
import request from 'arcdynamic-request';
import Editable from '../Editable';
import { setLogin } from '../../actions';

export default class extends React.Component {
	state = {
		page: null,
	};

	_fetch = (pageCode, isAdmin)=>{
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'Pages', {
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
		}, {
			expires: isAdmin ? false : 1000*60*60,
		}).then((res)=>{
			this.setState({
				page: res && res.success && res.data && res.data.length ? res.data[0] : false,
			});
		});
	};

	_save = content => {
		return request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.updateByTableCode',
			params: ['Pages', {
				value: [{
					MAIN: content,
					ARCIMEDES_ROW_ID: this.state.page.ARCIMEDES_ROW_ID,
				}],
			}],
		}).then(res=>{
			if (res.errorCode === 'E10P0A3') {
				setLogin(true, ()=> this._save(content, true))
			}
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
		if (this.state.page === undefined) return null;

		if (this.state.page === false && !this.props.isAdmin) return <Error404/>;

		const page = {TITLE: '', MAIN: '', ...this.state.page};
        const video = `${arc.path.media}STRIVE_Video.mp4`;

		document.title = page.TITLE;

		return (
			<div className='Page'>
				{
                    page.TITLE === 'How' &&
                	<video id='howVideo' controls src={video}/>
                }
				<Editable content={page.MAIN} isHTML={true} enabled={this.props.isAdmin} onSave={this._save}/>
			</div>
		);
	}
}