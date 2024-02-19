import React from 'react';
import Hero from '../Hero';
import HomeWhat from '../HomeWhat';
import HomeHow from '../HomeHow';
import HomeWhy from '../HomeWhy';
import HomeListings from '../HomeListings';

export default (props)=> {
	return(
	<div className='Home'>
		<HomeListings/>
		<Hero isAdmin={props.isAdmin}/>
		<HomeWhat/>
		<HomeHow/>
		<HomeWhy/>
	</div>);
};