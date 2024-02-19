import React from 'react';
import Icon from "../Icon";
import arrowRight from "../../svgs/arrow-right.svg";
import Slider from "../Slider/Slider";
import ListingStats from "../ListingStats";
import {PropertyStats} from "../../utils/models";

export default class extends Slider {
    render () {
        const listings = this.props.slides;
        const index = this.state.index;

        return (
            <div className='listings-slider-container'>
                <div className='listings-slider-arrow left'
                     onClick={this.prev}>
                    <Icon svg={arrowRight}/>
                </div>
                <div className='listing-slides'>
                    {
                        listings && listings.map((listing, i) => {
                            if (listing instanceof PropertyStats) {
                                return (
                                    <div className={`listing-slide ${i === index ? 'active' : ''}`} style={{transform: `translate3d(${-i*100}%,0,0)`}}>
                                        {
                                            i === index &&
                                            <ListingStats
                                                stats={listing}
                                                name={listing.name}
                                                background={listing.background}
                                                logo={listing.logo}
                                                annotation={listing.annotation}
                                                isMtStatsPage={listing.isMtStatsPage}
                                                statsKeys={listing.statsKeys}
                                            />
                                        }
                                    </div>
                                )
                            }

                            const photo = listing.WEBSITE_PHOTO_1 ? listing.WEBSITE_PHOTO_1 : '';
                            return (
                                <div className={`listing-slide ${i===index ? 'active' : ''}`} style={{transform: `translate3d(${-i*100}%,0,0)`}}>
                                    {photo && <div className='listings-slider-img' style={{backgroundImage: `url("${arc.path.media+photo}")`}} alt=''/>}
                                    <div className='listings-slider-overlay'/>
                                    <div className='listings-slider-description'>
                                        <a className='listings-slider-description-name' href={arc.path.base + 'property/' + listing.ARCIMEDES_ROW_ID}>{listing.NAME}</a>
                                        <a className='listings-slider-description-city' href={arc.path.base + 'property/' + listing.ARCIMEDES_ROW_ID}>{listing.CITY}, {listing.STATE}</a>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='listings-slider-arrow right'
                     onClick={this.next}>
                    <Icon svg={arrowRight}/>
                </div>
            </div>
        )
    }
}