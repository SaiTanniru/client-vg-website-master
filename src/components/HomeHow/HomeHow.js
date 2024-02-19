import React from 'react';
import Cycle from '../Cycle2';

const items = [
	(
		<div className='HomeHow_item'>
			<div>LOCAL EXPERTISE</div>
			<div><b>NATIONAL REACH</b></div>
			<div><a className='HomeHow_button' href={arc.path.base+'how'}>Learn More</a></div>
		</div>
	),
	(
		<div className='HomeHow_item'>
			<div>YOUR CURRENT REAL ESTATE INVESTMENTS</div>
			<div>DRIVE FUTURE INVESTING OPPORTUNITIES.</div>
			<div><b>WE’RE YOUR CHAUFFEUR.</b></div>
			<div><a className='HomeHow_button' href={arc.path.base+'how'}>Learn More</a></div>
		</div>
	),
	(
		<div className='HomeHow_item'>
			<div>AUT VIAM INVENIAM AUT FACIAM</div>
			<div className='HomeHow_item_normal'><small>Latin for "I shall either find a way or make one."</small></div>
			<div><a className='HomeHow_button' href={arc.path.base+'how'}>Learn More</a></div>
		</div>
	),
];

export default ()=> (
	<div className='HomeHow' style={{backgroundImage: `url("${arc.path.media}green_map.png")`}}>
		<Cycle items={items}/>
	</div>
);
