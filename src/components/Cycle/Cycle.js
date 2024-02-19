import React from 'react';

export default class extends React.Component {
	state = {
		index: 0,
	};
	componentDidMount() {
		this._cycle();
	}
	componentWillUnmount() {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
	}
	_cycle = ()=>{
		if (this.props.items.length > 1) {
			this.timeout = setTimeout(()=> {
				this.setState({
					index: this.state.index+1 >= this.props.items.length ? 0 : this.state.index+1
				});
				this._cycle();
			}, 5000);
		}
	};
	render() {
		return (
			<div className='Cycle'>
				{
					this.props.items.map((el,i) => (
						<div key={i} className={'Cycle_item'+(i===this.state.index ? ' Cycle_item--is-active' : '')} style={{transform: `translate3d(${-i*100}%,0,0)`}}>
							<div className='Cycle_item_body'>{el}</div>
						</div>
					))
				}
			</div>
		);
	}
}
