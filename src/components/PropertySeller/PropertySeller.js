import React from 'react';
import request from 'arcdynamic-request';

export default class extends React.Component {
    _fetchSeller = (id) => {
        if (id) {
            request(arc.path.api, {
                service: 'arcimedes',
                action: 'open.datasource.table.Data.getData',
                params: ['code', 'SELLERS', {
                    column: [
                        'FIRST_NAME',
                        'LAST_NAME',
                    ],
                    limit: {
                        count: 1,
                        offset: 0,
                    },
                    filter: [
                        {
                            code: 'ARCIMEDES_ROW_ID',
                            text: id,
                            type: 'exact',
                        },
                        {
                            code: 'DELETED',
                            text: '',
                            type: 'null',
                        },
                    ],
                    filterType: 'and',
                }],
            }, {
                expires: 1000*60*60,
            }).then(res => {
                this.setState({seller: res.success && res.data.length ? res.data[0] : false});
            });
        }
    };
    state = {
        seller: null,
    };
    componentDidMount() {
        if (this.props.sellerId) {
            this._fetchSeller(this.props.sellerId);
        }
    }
    render() {
        const seller = this.state.seller;

        if (!seller) return null;

        return (
            <div className='PropertySeller'>
                <div className='PropertySeller_name'>Seller: {seller.FIRST_NAME} {seller.LAST_NAME}</div>
            </div>
        )
    }
}