import React from 'react';
import dollarFormat from '../../dollar-format';

function getItems(property) {
	const stats = [
		{
			key: 'LIST_PRICE',
			title: 'Price',
			format: val => {
				if (property.HIDE_FINANCIALS === 'y' || property.STATUS === 'Closed') {
					return null;
				}
				
				return dollarFormat(val);
			}
		},
		{
			key: 'CAPITALIZATION_RATE',
			title: 'Cap Rate',
			format: val => {
				if (property.HIDE_FINANCIALS === 'y' || property.STATUS === 'Closed' || property.IS_PROFORMA_PRICING === 'y') {
					return null;
				}
				const number = Number(val);
				return number !== number ? val : (number.toFixed(2)+'%');
			},
		},
		{
			key: 'PROFORMA_CAP_RATE',
			title: 'Cap Rate',
			format: val => {
				if (property.HIDE_FINANCIALS === 'y' || property.STATUS === 'Closed' || property.IS_PROFORMA_PRICING !== 'y') {
					return null;
				}
				const number = Number(val);
				return number !== number ? val : (number.toFixed(2)+'%');
			},
		},
		{
			key: 'NET_OPERATING_INCOME',
			title: 'NOI',
			format: val => (property.HIDE_FINANCIALS === 'y' || property.STATUS === 'Closed' || property.IS_PROFORMA_PRICING === 'y') ? null : dollarFormat(val),
		},
		{
			key: 'PROFORMA_NOI',
			title: 'NOI',
			format: val => (property.HIDE_FINANCIALS === 'y' || property.STATUS === 'Closed'  || property.IS_PROFORMA_PRICING !== 'y') ? null : dollarFormat(val),
		},
		{
			key: 'VACANCY',
			title: 'Occupancy',
			format: val => {
				const number = property.LEASE_TYPE === 'Vacant' ? 0 : Number(val);
				return number !== number ? val : (number+'%');
			},
		},
		{
			key: 'LEASE_TYPE',
			title: 'Lease Type',
			format: val => val,
		},
		{
			key: 'YEAR_BUILT',
			title: 'Year Built',
			format: val => val,
		},
		{
			key: 'LEASE_COMMENCEMENT_DATE',
			title: 'Commencement Date',
			format: val => {
				const d = new Date(val);
				return (d.getUTCMonth()+1)+'/'+d.getUTCDate()+'/'+d.getUTCFullYear()
			},
		},
		{
			key: 'LEASE_EXPIRATION_DATE',
			title: 'Expiration Date',
			format: val => {
				const d = new Date(val);
				return (d.getUTCMonth()+1)+'/'+d.getUTCDate()+'/'+d.getUTCFullYear()
			},
		},
		{
			key: 'SQFT',
			title: 'Square Feet',
			format: val => Number(val).toLocaleString(),
		},
	];
	
	const items = [];
	if(property.LEASE_TYPE && property.LEASE_TYPE == 'VACANT'){
		property['VACANCY'] = 0;
	}

	stats.forEach(el => {
		if (property[el.key]) {
			const value = el.format(property[el.key])
			if (value != null && (!(Object.keys(property).includes("SALE_LEASE_BACK") && (el.key=='LEASE_COMMENCEMENT_DATE' || el.key=='LEASE_EXPIRATION_DATE')))) {
					items.push((
						<dl key={el.key}>
							<dt>{el.title}:</dt>
							<dd>{value}</dd>
							{el.key.includes('PROFORMA') && <span>  (proforma)</span>}
						</dl>
					))
				}			
		}
	})
	

	if (property.LEASE_EXPIRATION_DATE && !property.ORIGINAL_LEASE_TERM) {
        let exp = 0;
        if (property.STATUS.toLowerCase() === 'closed') {
            exp = property.CLOSE_OF_ESCROW ? new Date(property.LEASE_EXPIRATION_DATE).getTime() - new Date(property.CLOSE_OF_ESCROW).getTime() : 0;
        } else {
            exp = new Date(property.LEASE_EXPIRATION_DATE).getTime() - Date.now();
        }

		if (exp > 0) {
			const day = 24 * 60 * 60 * 1000;
			const year = 365 * day;
			const yearsLeft = Math.round((exp / year)*10)/10;
			const term = yearsLeft+' '+(yearsLeft > 1 ? 'years' : 'year');

			items.push((
				<dl key='remaining_term'>
					<dt>Remaining Term:</dt>
					<dd>{term}</dd>
				</dl>
			))
		}

	}
	if (property.ORIGINAL_LEASE_TERM) {
		items.push((
			<dl key='remaining_term'>
				<dt>Original Lease Term:</dt>
				<dd>{property.ORIGINAL_LEASE_TERM} years</dd>
			</dl>
		))
	}

	return items;
}

export default ({ property }) => (
	<div className='PropertyStats'>
		{
			getItems(property)
		}
	</div>
);
