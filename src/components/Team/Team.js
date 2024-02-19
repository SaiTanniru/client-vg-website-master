import React from 'react';
import imgSrc from 'arcdynamic-resize';
import request from 'arcdynamic-request';
import Bio from '../Bio';

export default class extends React.Component {
	_fetch = () => {
		request(arc.path.api, {
			service: 'arcimedes',
			action: 'open.datasource.table.Data.getData',
			params: ['code', 'TEAM', {
				filter: [
					{
						code: 'FIRST_NAME',
						text: '',
						type: 'notNull',
					},
					{
						code: 'LAST_NAME',
						text: '',
						type: 'notNull',
					},
					{
						code: 'DELETED',
						text: 'n',
						type: 'exact',
					},
					{
						code: 'VISIBLE_ON_WEBSITE',
						text: 'y',
						type: 'exact',
					},
				],
				filterType: 'and',
				limit: {
					count: 100,
					offset: 0,
				},
			}],
		}, {
			expires: 1000*60*60,
		}).then(res => {
			const team = res.success ? JSON.parse(JSON.stringify(res.data)) : null;
			if (team) {
				let top = [];
				for (let i = 0; i<team.length; i++) {
					if (team[i].FIRST_NAME.toLowerCase() === 'jennifer' && team[i].LAST_NAME.toLowerCase() === 'pierson') {
						top.push(team[i]);
						team.splice(i,1);
						break;
					}
				}
				for (let i = 0; i<team.length; i++) {
					if (team[i].FIRST_NAME.toLowerCase() === 'jason' && team[i].LAST_NAME.toLowerCase() === 'vitorino') {
						top.push(team[i]);
						team.splice(i,1);
						break;
					}
				}
				// add Join Our Team box
				top.push({isEmpty: true});
				team.sort((a,b)=> a.LAST_NAME.toLowerCase() < b.LAST_NAME.toLowerCase() ? -1 : 1);

				if (top.length) {
					team.unshift.apply(team,top);
				}
			}

			this.setState({
				team: team || [],
				isFetching: false,
			});
		});
	};
	state = {
		team: [],
		isFetching: true,
		buttonText: 'JOIN OUR TEAM!'
	};
	componentDidMount() {
		this._fetch();
	}
	onMouseEnter = () => {
		this.setState({buttonText: 'CLICK HERE'});
	};
	onMouseLeave = () => {
        this.setState({buttonText: 'JOIN OUR TEAM!'});
    };
	render() {
		const { team, isFetching, buttonText } = this.state;
		const photoWidth = 373;

		if (team === null) {
			return null;
		}

		return (
			<div className='Team'>
				<div className='Team_photos'>
					<div className='Team_photos_contain'>
						{
							isFetching ? (
								[...Array(18)].map((el,i) => <div key={i} className='Team_photos_item'/>)
							) : team.map((el) => (
								el.isEmpty ?
									(<a href={arc.path.base+'join-our-team'} className='Team_joinOurTeam' onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
										{buttonText}
									</a>)
									:
									(<a href={'#id'+el.ARCIMEDES_ROW_ID} key={el.ARCIMEDES_ROW_ID} className='Team_photos_item' style={{backgroundImage: `url("${imgSrc(arc.path.media+el.PHOTO, photoWidth)}")`}}>
										<div className='Team_photos_item_body'>
											<div className='Team_photos_item_name'>{el.FIRST_NAME} {el.LAST_NAME}</div>
											<div className='Team_photos_item_role'>{el.TITLE}</div>
										</div>
									</a>)
							))
						}
						<div className='Team_photos_spacer'/>
						<div className='Team_photos_spacer'/>
						<div className='Team_photos_spacer'/>
					</div>
				</div>
				<div className='Team_bios'>
					<div className='Team_bios_contain'>
						{
							team.map(el =>
                                !el.isEmpty &&
								<div id={'id'+el.ARCIMEDES_ROW_ID} className='margin'>
									<Bio profile={el} key={el.ARCIMEDES_ROW_ID} photoWidth={photoWidth}/>
								</div>
							)
						}
					</div>
				</div>
			</div>
		);
	}
}
