import React from 'react';
import ListingsSlider from '../ListingsSlider';
import {getData} from "../../utils/CRUD";
import {executeQuery} from "../../utils/executeQuery";
import {PropertyStats} from "../../utils/models";
import { cbBackground, cbLogo, striveLogo, txMTBackground, stnlBackground } from '../../utils/utils';

const listingsNo = 8;

export default class extends React.Component {
    constructor() {
        super();
        this.state = {
            listings: null,
            cbBackgroundLoaded: false,
            cbLogoLoaded: false,
            txMTBackgroundLoaded: false,
            stnlBackgroundLoaded: false,
        };

        this.cbBackgroundRef = React.createRef();
        this.cbLogoRef = React.createRef();
        this.txMTBackgroundRef = React.createRef();
        this.stnlBackgroundRef = React.createRef();
    }

    fetch() {
        const recentListingsOptions = {
            column: [
                'ARCIMEDES_ROW_ID',
                'NAME',
                'CITY',
                'STATE',
                'WEBSITE_PHOTO_1',
            ],
            filter: [
                {
                    code: 'SOURCE',
                    text: 'STRIVE',
                    type: 'exact',
                },
                {
                    code: 'STATUS',
                    text: 'Active',
                    type: 'exact',
                },
                {
                    code: 'TRANSACTION_TYPE',
                    text: 'Investment Sales',
                    type: 'exact',
                },
                {
                    code: 'STRIVE_SLIDER',
                    text: 'y',
                    type: 'exact',
                },
                {
                    code: 'DELETED',
                    text: '',
                    type: 'null',
                },
            ],
            filterType: 'and',
            order: [
                {
                    code: 'ARCIMEDES_ROW_ID',
                    type: 'desc',
                },
            ],
            limit: {
                count: listingsNo,
                offset: 0,
            },
        };

        const listingStatsParams = {
            NAME: 'Christian Brothers Automotive',
        };
        const mtListingStatsParams = {
            TYPE: 'MT',
        };
        const stnlListingStatsParams = {
            TYPE: 'STNL',
        };
        Promise.all([
            getData({tableCode: 'PROPERTIES', options: recentListingsOptions}),
            executeQuery({queryName: 'PROPERTY_STATS_BY_NAME', params: listingStatsParams}),
            executeQuery({queryName: 'PROPERTY_STATS_BY_TYPE', params: mtListingStatsParams}),
            executeQuery({queryName: 'PROPERTY_STATS_BY_TYPE', params: stnlListingStatsParams}),
        ]).then(res => {
            if (!res || !res[0] || !res[0].success || !res[1] || !res[1].success) {
                this.setState({
                    listings: null,
                });
            }
            const cba = new PropertyStats({
                data: res[1].data[0],
                name: 'Christian Brothers Automotive',
                logo: cbLogo,
                background: cbBackground,
            });

            const mt = new PropertyStats({
                data: res[2].data[0],
                logo: striveLogo,
                background: txMTBackground,
                annotation: 'Leader of Multi-Tenant Sales in Texas',
                isMtStatsPage: true
            });

            const stnl = new PropertyStats({
                data: res[3].data[0],
                logo: striveLogo,
                background: stnlBackground,
                annotation: 'Leader of Single-Tenant Sales in Texas',
                isMtStatsPage: true
            });

            let cbBackgroundLoaded, cbLogoLoaded, txMTBackgroundLoaded, stnlBackgroundLoaded = false;
            if (this.cbBackgroundRef.current.complete)
                cbBackgroundLoaded = true;
            if (this.cbLogoRef.current.complete)
                cbLogoLoaded = true;
            if (this.txMTBackgroundRef.current.complete)
                txMTBackgroundLoaded = true;
            if (this.stnlBackgroundRef.current.complete)
                stnlBackgroundLoaded = true;

            this.setState({
                listings: [cba, mt, stnl, ...res[0].data],
                cbBackgroundLoaded,
                cbLogoLoaded,
                txMTBackgroundLoaded
            });
        });
    }

    componentDidMount() {
        this.fetch();
    }

    render() {
        const {listings, cbBackgroundLoaded, cbLogoLoaded, txMTBackgroundLoaded, stnlBackgroundLoaded} = this.state;
        const imagesLoaded = cbBackgroundLoaded && cbLogoLoaded && txMTBackgroundLoaded && stnlBackgroundLoaded;

        return (
            <React.Fragment>
                <img className='preload-image' ref={this.cbBackgroundRef} src={cbBackground} onLoad={() => this.setState({cbBackgroundLoaded: true})}/>
                <img className='preload-image' ref={this.cbLogoRef} src={cbLogo} onLoad={() => this.setState({cbLogoLoaded: true})}/>
                <img className='preload-image' ref={this.txMTBackgroundRef} src={txMTBackground} onLoad={() => this.setState({txMTBackgroundLoaded: true})}/>
                <img className='preload-image' ref={this.stnlBackgroundRef} src={txMTBackground} onLoad={() => this.setState({stnlBackgroundLoaded: true})}/>
                {imagesLoaded && <ListingsSlider slides={listings}/>}
            </React.Fragment>
        )
    }
}