import React from 'react';
import Cycle from '../Cycle2';

const items = [
	(
		<div className='HomeWhat_item'>
			<div>RETAIL IN TEXAS & SURROUNDING STATES</div>
			<div>MULTI & SINGLE TENANT</div>
			<div><b>INVESTMENT SALES</b></div>
			<div><a className='HomeWhat_button' href={arc.path.base+'what'}>Learn More</a></div>
		</div>
	),
	(
		<div className='HomeWhat_item'>
			<div>ATTRACTING ABUNDANT ATTENTION TO YOUR</div>
			<div>REAL ESTATE ASSET, LEADS TO HIGHER RETURNS.</div>
			<div><b>WE’RE YOUR MAGNET.</b></div>
			<div><a className='HomeWhat_button' href={arc.path.base+'what'}>Learn More</a></div>
		</div>
	),
	(
		<div className='HomeWhat_item'>
			<div><b>WE CLOSE TRANSACTIONS.</b></div>
			<div>SPEED. EFFICIENCY. EXECUTION. RESULTS.</div>
			<div><a className='HomeWhat_button' href={arc.path.base+'listings/history?map=1'}>Learn More</a></div>
		</div>
	),
];

export default ()=> (
	<div className='HomeWhat' style={{backgroundImage: `url("${arc.path.media}map.jpg")`}}>
		<Cycle items={items}/>
	</div>
);
