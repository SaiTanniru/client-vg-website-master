import React from 'react';
import Icon from '../Icon';
import svgMapMarker from '../../svgs/map-marker.svg';

export default ({ property })=> (
	<div className='PropertyHead'>
		<div className='PropertyHead_body'>
			<div className='PropertyHead_body_name'>{property.NAME}</div>
			<div className='PropertyHead_body_address'>
				<div>{property.ADDRESS}</div>
				<div>{property.CITY}, {property.STATE} {property.ZIP}</div>
			</div>
		</div>
		{
			property.LONGITUDE && property.LATITUDE ? (
				<a href={`http://maps.google.com/maps?z=14&t=m&q=loc:${property.LATITUDE}+${property.LONGITUDE}`} target='_blank' rel='noopener' className='PropertyHead_map'>
					<span className='PropertyHead_map_icon'><Icon svg={svgMapMarker}/></span>
					<span>view map</span>
				</a>
			) : null
		}
	</div>
)