import React from 'react';
import imgSrc from 'arcdynamic-resize';
import dollarFormat from '../../dollar-format';

export default ({listings, showMore, returnUrl, link = true})=> (
	<div className='Listings'>
		<div className='Listings_container'>
			<div className='Listings_list'>
				{
					listings ? listings.map((el,i) => {
						const stats = [];
						let src = el.WEBSITE_PHOTO_1 ? imgSrc(arc.path.media+el.WEBSITE_PHOTO_1,390) : null;

						if (el.STATUS !== 'Closed' && el.HIDE_FINANCIALS !== 'y') {
							if (el.LIST_PRICE) {
								stats.push('Price: '+dollarFormat(el.LIST_PRICE))
							}
							if (el.CAPITALIZATION_RATE) {
								const number = Number(el.CAPITALIZATION_RATE);
								stats.push('Cap Rate: '+(number !== number ? el.CAPITALIZATION_RATE : (number.toFixed(2)+'%')));
							}
						}

						return link ? (
							<a key={i} href={arc.path.base+'property/'+el.ARCIMEDES_ROW_ID+(returnUrl ? '?back='+encodeURIComponent(returnUrl) : '')} className='Listings_item'>
								<div className='Listings_item_polaroid'>
									<div className='Listings_item_image' style={{backgroundImage: `url("${src}")`}}/>
									<div className='Listings_item_name'>{el.NAME}</div>
									<div className='Listings_item_addr'>{el.CITY}, {el.STATE}</div>
								</div>
								<div className='Listings_item_body'>
									<div className='Listings_item_name'>{el.NAME}</div>
									<div className='Listings_item_addr'>{el.CITY}, {el.STATE}</div>
									{stats.length ? <div className='Listings_item_info'>{stats.join(' | ')}</div> : null}

									{el.STATUS && <div className='Listings_item_more'>{el.STATUS === 'Active' ? 'Available' : el.STATUS}</div>}

									<div className='Listings_item_more' style="margin-top: 5px;">More info</div>
								</div>
							</a>
						) : (
							<div key={i} className='Listings_item'>
                                <div className='Listings_item_polaroid'>
                                    <div className='Listings_item_image' style={{backgroundImage: `url("${src}")`}}/>
                                    <div className='Listings_item_name'>{el.NAME}</div>
                                    <div className='Listings_item_addr'>{el.CITY}, {el.STATE}</div>
                                </div>
								<div className='Listings_item_body'>
									<div className='Listings_item_name'>{el.NAME}</div>
									<div className='Listings_item_addr'>{el.CITY}, {el.STATE}</div>
								</div>
							</div>
						)
					}) : null
				}
				{
					showMore ? (
						<a href={arc.path.base+'listings'} className='Listings_item Listings_item--more'>
							<span>View all</span> <span>listings</span>
						</a>
					) : null
				}
				<a className='Listings_item Listings_item--spacer'/>
				<a className='Listings_item Listings_item--spacer'/>
			</div>
		</div>
	</div>
);
