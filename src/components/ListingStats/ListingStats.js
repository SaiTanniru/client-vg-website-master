import React from 'react';
import {dollars, striveLogo} from "../../utils/utils";

const hexagon = `${arc.path.media}eb809053988a73fd2ebb1f0b2538abcd41f2eb587a039d54b9eeb2497473b94600d50fd21de6c22b38598191cd9cdf72ee3a65fe0eedab6118874175ccda3985_hexagon.png`;
const speed = 30;

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            prices: props.statsKeys.reduce((accumulator, value) => ({...accumulator, [value]: '$0'}), {})
        }

        this.animatePrices = this.animatePrices.bind(this);
    }

    componentDidMount() {
        this.animatePrices();
    }
    
    animatePrices() {
        const prices = this.state.prices;
        this.props.statsKeys.forEach(key => {
            const counter = document.getElementById(`stats-price-${key}`);
            const value = parseInt(document.getElementById(`stats-price-${key}`).getAttribute('finalNumber'));
            const animate = () => {
                const data = +parseInt(counter.innerText.replaceAll(/[$,]/g, ''));
                const time = value / speed;
                if (data < value) {
                    counter.innerText = dollars(Math.ceil(data + time));
                    setTimeout(animate, 100);
                } else {
                    counter.innerText = dollars(value);
                    prices[key] = dollars(value);
                }
            };
            animate();
        });
        this.setState({prices});
    }

    render() {
        const {stats, background, name, logo, annotation, isMtStatsPage, statsKeys} = this.props;
        const {prices} = this.state;
        const isAnimationRequired = annotation.toLowerCase().indexOf("single-tenant")>=0;
        return (
            <div className='ListingStats'>
                <div className='listings-slider-img'
                     style={{backgroundImage: `url("${background}")`}}
                />
                <div className={`listing-stats-container ${isMtStatsPage ? 'no-margin':''}`}>
                    <div className='property-container'>
                        <div className='property-text'>
                            {name}
                        </div>
                        <div className={`property-logo ${isMtStatsPage ? 'strive-logo-large' : '' }`}
                             style={{backgroundImage: `url("${logo}")`}}
                        />
                        <div className='property-annotation'>
                            {annotation}
                        </div>
                    </div>
                    <div className='all-stats-container'>
                        {
                            stats && statsKeys.map(key => {
                                if (!isMtStatsPage && key === 'underContract' && !stats.underContractProperties)
                                    return;
                                const isClosed = key === 'closed';
                                return (
                                    <div className={`stats-container ${isClosed ? 'bigger' : ''} ${isAnimationRequired ?"states-animation":""}`}>
                                        <div className='stats-hexagon'
                                             style={{backgroundImage: `url("${hexagon}")`}}>
                                            <div className={`stats-status ${isClosed ? 'bigger' : ''}`}>
                                                {stats[`${key}Label`]}
                                            </div>
                                        </div>
                                        <div className='stats-numbers'>
                                            <div className='stats-background'/>
                                            <div className='stats-count'>
                                                {stats[`${key}Properties`]}
                                                {isClosed ? ' Transactions' : ' Properties'}
                                            </div>
                                            <div className='stats-price'
                                                 id={`stats-price-${key}`}
                                                 finalNumber={stats[`${key}Price`]}>
                                                {prices[key]}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        !isMtStatsPage &&
                        <div className='strive-logo'
                             style={{backgroundImage: `url("${striveLogo}")`}}
                        />
                    }
                </div>
            </div>
        )
    }
}