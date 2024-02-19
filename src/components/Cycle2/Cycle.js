import React from 'react';

export default class extends React.Component {
	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {
		return (
			<div className='Cycle2'>
				{
					this.props.items.map((el,i) => (
						<div key={i} className={'Cycle2_item2'}>
							{el}
						</div>
					))
				}
			</div>
		);
	}
}
