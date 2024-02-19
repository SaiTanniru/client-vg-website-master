import React from 'react';
import Listings from '../Listings';
import request from 'arcdynamic-request';
import ListingsHead from '../ListingsHead';
import ListingsMap from '../ListingsMap';

export default class extends React.Component {
    excludeByStatus(listings) {
    	// Show only properties with STATUS: Active, In Negotiation, Under contract, or Closed
    	const status = ['Active', 'In Negotiation', 'Under Contract', 'Closed'];
		return listings
			.filter(listing => status.includes(listing.STATUS))
			.map(listing => listing);
	}
	_fetch = (mode, query)=>{
		const opts = {
			column: [
				'ARCIMEDES_ROW_ID',
				'NAME',
				'CITY',
				'STATE',
				'WEBSITE_PHOTO_1',
				'LATITUDE',
				'LONGITUDE',
				'ZIP',
				'ADDRESS',
				'STATUS',
				'LIST_PRICE',
				'CAPITALIZATION_RATE',
				'HIDE_FINANCIALS',
				'SOURCE',
				'BUYER_AGENT_4_FIRM'
				
			],
			
			filter: [
						{
							code: 'VISIBLE',
							text: 'y',
							type: 'exact',
						},
						{
							code: 'DELETED',
							text: '',
							type: 'null',
						},
				],
			filterType: 'and',
			order: [],
			limit: {
				count: 1000,
				offset: 0,
			},
		};

		if (mode !== 'history') {
			if (query['min-price'] && query['min-price'].replace(/[^\d.]/g,'')) {
				opts.filter.push({
					code: 'LIST_PRICE',
					text: query['min-price'].replace(/[^\d.]/g,''),
					type: '>=',
				})
				opts.order.push({
					code: 'LIST_PRICE',
					type: 'asc',
				})
			}

			if (query['max-price'] && query['max-price'].replace(/[^\d.]/g,'')) {
				opts.filter.push({
					code: 'LIST_PRICE',
					text: query['max-price'].replace(/[^\d.]/g,''),
					type: '<=',
				})
				opts.order.push({
					code: 'LIST_PRICE',
					type: 'asc',
				})
			}

			if (query['min-cap'] && query['min-cap'].replace(/[^\d.]/g,'')) {
				opts.filter.push({
					code: 'CAPITALIZATION_RATE',
					text: query['min-cap'].replace(/[^\d.]/g,''),
					type: '>=',
				})
				opts.order.push({
					code: 'CAPITALIZATION_RATE',
					type: 'asc',
				})
			}

			if (query['max-cap'] && query['max-cap'].replace(/[^\d.]/g,'')) {
				opts.filter.push({
					code: 'CAPITALIZATION_RATE',
					text: query['max-cap'].replace(/[^\d.]/g,''),
					type: '<=',
				})
				opts.order.push({
					code: 'CAPITALIZATION_RATE',
					type: 'asc',
				})
			}
		}

		switch (mode) {
			case 'single-tenant':
				opts.filter.push({
					code: 'TYPE',
					text: 'STNL',
					type: 'exact',
				})
				opts.filter.push({
					code: 'CLOSE_OF_ESCROW',
					text: '',
					type: 'null',
				})
				opts.order.push({
					code: 'FEATURED',
					type: 'desc',
				})
				opts.order.push({
					code: 'LISTED_DATE',
					type: 'desc',
				})
				break;
			case 'multi-tenant':
				opts.filter.push({
					code: 'TYPE',
					text: 'MT',
					type: 'exact',
				})
				opts.filter.push({
					code: 'CLOSE_OF_ESCROW',
					text: '',
					type: 'null',
				})
				opts.order.push({
					code: 'FEATURED',
					type: 'desc',
				})
				opts.order.push({
					code: 'LISTED_DATE',
					type: 'desc',
				})
				break;
			case 'history':
				opts.filter.push({
					code: 'CLOSE_OF_ESCROW',
					text: '',
					type: 'notNull',
				})
				opts.order.push({
					code: 'CLOSE_OF_ESCROW',
					type: 'desc',
				})
				break;
			default:
				opts.filter.push({
					code: 'CLOSE_OF_ESCROW',
					text: '',
					type: 'null',
				})
				opts.order.push({
					code: 'FEATURED',
					type: 'desc',
				})
				opts.order.push({
					code: 'LISTED_DATE',
					type: 'desc',
				})
				break;
		}

		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'PROPERTIES', opts],
		}, {
			expires: 1000*60*60,
		}).then(res => {
			if (!res || !res.success) {
                this.setState({listings: null});
            }

			const data = this.excludeByStatus(res.data);
			if (mode == 'history')
			{				
				const historyData = data.filter(x => { return x.SOURCE == 'STRIVE' || (x.SOURCE == 'External' && x.BUYER_AGENT_4_FIRM == '34')});
				this.setState({listings: historyData});
			}
			else {
				this.setState({listings: data});
			}

			
		});
	};
	state = {
		listings: null
	};
	componentDidMount() {
		this._fetch(this.props.mode, this.props.location.query);
	}
	componentWillUpdate(nextProps) {
		if (nextProps.location.href !== this.props.location.href) {
			this._fetch(nextProps.mode, nextProps.location.query);
		}
	}
	render() {
		const { mode, location } = this.props;

		let content = <div/> // loading

		const returnUrl = location.pathname+location.search;

		if (this.state.listings) {
			if (location.query.map) {
				content = <ListingsMap returnUrl={returnUrl} listings={this.state.listings} link={mode !== 'history'}/>
			} else {
				content = <Listings returnUrl={returnUrl} listings={this.state.listings} link={mode !== 'history'}/>
			}
		}

		return (
			<div className='History'>
				<div className='History_head'>
					<ListingsHead mode={mode} location={location}/>
				</div>
				{ content }
			</div>
		);
	}
}