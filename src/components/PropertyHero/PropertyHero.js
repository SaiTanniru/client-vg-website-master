import React from 'react';
import PropertyPhotos from '../PropertyPhotos';
import PropertyStats from '../PropertyStats';
import PropertyContact from '../PropertyContact';
import PropertyBroker from '../PropertyBroker';
import PropertyHead from '../PropertyHead';
import PropertySeller from '../PropertySeller';

export default ({data, isUser, downloadPackage}) => {
	const photos = [data.WEBSITE_PHOTO_1, data.WEBSITE_PHOTO_2, data.WEBSITE_PHOTO_3, data.WEBSITE_PHOTO_4, data.WEBSITE_PHOTO_5].filter(el => el);
    return (
        <div className='PropertyHero'>
            <div className='PropertyHero_media'>
                <PropertyPhotos address={data.ADDRESS} photos={photos}/>
                {
                    data.VIDEO_URL ? (
                        <div className='PropertyHero_media_video'>
                            <a href={data.VIDEO_URL} target='_blank' rel='noopener'>Watch video</a>
                        </div>
                    ) : null
                }
            </div>
            <div className='PropertyHero_info'>
                <PropertyHead property={data}/>
                {
                    data.STATUS ? (
                        <div className={'PropertyHero_status PropertyHero_status--' + data.STATUS.toLowerCase().replace(' ', '-')}>
                            {data.STATUS === 'Active' ? 'Available' : data.STATUS}
                        </div>
                    ) : null
                }
                {
                    (isUser || data.STATUS !== 'Closed') && <PropertyStats property={data}/>
                }
                {
                    isUser && data.MEDIA_KIT &&
                    <a className='PropertyHero_btn' href={arc.path.media + data.MEDIA_KIT} target='_blank' rel='noopener'>Download Package</a>
                }
                {
                    !isUser && data.STATUS !== 'Closed' && data.MEDIA_KIT &&
                    <div className='PropertyHero_btn' onClick={() => downloadPackage()}>Download Package</div>
                }
                {
                    isUser && data.SOURCE && data.SOURCE === 'STRIVE' &&
                    <a className='PropertyHero_btn' href={`https://app.strivere.com/property/${data.ARCIMEDES_ROW_ID}`} target='_blank'>View Financials</a>
                }
                {
                    isUser && data.SOURCE && data.SOURCE === 'STRIVE' && data.STATUS === 'Under Contract' &&
                    <a className='PropertyHero_btn'
                       href={`https://app.strivere.com/escrow-tracking/${data.ARCIMEDES_ROW_ID}`} target='_blank'>Escrow Tracking</a>
                }
                {
                    (isUser || data.STATUS !== 'Closed') &&
                    ['LISTING_AGENT_1', 'LISTING_AGENT_2', 'LISTING_AGENT_3']
                        .filter(key => data[key])
                        .map((key, i) => <PropertyContact key={i} id={data[key]} name={data.NAME} city={data.CITY} state={data.STATE}/>)
                }
                {
                    isUser && data.LISTING_AGENT_4 ?
                        <div>
                            <PropertySeller sellerId={data.SELLER_ID}/>
                            <PropertyBroker agentId={data.LISTING_AGENT_4} firmId={data.LISTING_AGENT_4_FIRM} name={data.NAME} city={data.CITY} state={data.STATE}/>
                        </div>
                        : null
                }
            </div>
        </div>
    );
};
