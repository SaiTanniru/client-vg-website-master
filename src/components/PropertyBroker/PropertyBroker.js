import React from 'react';
import request from 'arcdynamic-request';

export default class extends React.Component {
	_fetchAgent = (id)=>{
		if (id) {
			request(arc.path.api, {
				service: 'arcimedes',
				action: 'open.datasource.table.Data.getData',
				params: ['code', 'AGENTS', {
					column: [
						'FIRST_NAME',
						'LAST_NAME',
						'EMAIL',
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
							text: '',
							type: 'null',
						},
					],
					filterType: 'and',
				}],
			}, {
				expires: 1000*60*60,
			}).then(res => {
				this.setState({agent: res.success && res.data.length ? res.data[0] : false});
			});
		}
	};
	_fetchFirm = (id)=>{
		if (id) {
			request(arc.path.api, {
				service: 'arcimedes',
				action: 'open.datasource.table.Data.getData',
				params: ['code', 'FIRMS', {
					column: [
						'NAME',
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
							text: '',
							type: 'null',
						},
					],
					filterType: 'and',
				}],
			}, {
				expires: 1000*60*60,
			}).then(res => {
				this.setState({firm: res.success && res.data.length ? res.data[0] : false});
			});
		}
	};
	state = {
		agent: null,
		firm: null,
	};
	static defaultProps = {
		size: 100,
	};
	componentDidMount() {
		if (this.props.agentId) {
			this._fetchAgent(this.props.agentId);
		}
		if (this.props.firmId) {
			this._fetchFirm(this.props.firmId);
		}
	}
	render() {
		const {agent, firm} = this.state;
        const subject = `${this.props.name} - ${this.props.city}, ${this.props.state}`;

		if (!agent) return null;

		return (
			<div className='PropertyBroker'>
				<div className='PropertyBroker_name'>Broker: {agent.FIRST_NAME} {agent.LAST_NAME}</div>
                { firm && firm.NAME ? <div className='PropertyBroker_firm'>Company: {firm.NAME}</div> : null }
                <a className='PropertyBroker_btn' href={`mailto:${agent.EMAIL ? agent.EMAIL : ''}?subject=${subject}`}>Email Broker</a>
			</div>
		)
	}
}