import React from 'react';
import MarkerClusterer from '../../markerclusterer.js';

export default class extends React.Component {
	static defaultProps = {
		latitude: 32.7801399,
		longitude: -96.80045109999998,
		zoom: 4,
	};
	
	// componentDidMount() {
	// 	this.map = new window.google.maps.Map(this._mapEl, {
	// 		zoom: this.props.zoom,
	// 		center: new window.google.maps.LatLng(this.props.latitude, this.props.longitude),
	// 		mapTypeId: window.google.maps.MapTypeId.ROADMAP,
	// 		scrollwheel: false,
	// 	});
	// 	this.setMarkers(this.props.listings);
	// }
	componentDidMount() {
		//creating new script element
		const script = document.createElement('script');
		// This sets the src attribute of the script element to the URL of the Google Maps JavaScript API, including the API key
		script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDGktwxbb0xZmCadduTN59ErIU_TBu4soE&libraries=places`;
		script.async = true;
		script.defer = true;
		script.onload = () => {
			this.initializeMap();
		};
		document.head.appendChild(script);
	}
	initializeMap() {

		this.map = new window.google.maps.Map(this._mapEl, {
			zoom: this.props.zoom,
			center: new window.google.maps.LatLng(this.props.latitude, this.props.longitude),
			mapTypeId: window.google.maps.MapTypeId.ROADMAP,
			scrollwheel: false,
		});
		this.setMarkers(this.props.listings);
	}
	map = null;
	infowindow = null;
	markers = [];
	setMarkers = (listings)=>{
		if (listings) {
			if (this.clusterer) {
				this.clusterer.clearMarkers();
			}

			this.markers = listings.filter(el => el.LATITUDE && el.LONGITUDE).map(el => {
				const content = `
					<div>
						<div><strong>${el.NAME}</strong></div>
						<div>${el.ADDRESS}</div>
						<div>${el.CITY}, ${el.STATE} ${el.ZIP}</div>
					</div>
				`;

				const href = arc.path.base+'property/'+el.ARCIMEDES_ROW_ID+(this.props.returnUrl ? '?back='+encodeURIComponent(this.props.returnUrl) : '')

				const infowindow = new window.google.maps.InfoWindow({
					content: this.props.link ? `<a href='${href}' style='display: block; color: inherit;'>${content}</a>` : content
				});

				const marker = new window.google.maps.Marker({
					position: {lat: parseFloat(el.LATITUDE), lng: parseFloat(el.LONGITUDE)},
				});

				marker.addListener('click', ()=> {
					if (this.infowindow) {
						this.infowindow.close();
					}
					this.infowindow = infowindow;
					infowindow.open(this.map, marker);
				});

				return marker;
			});

			var options = {
				imagePath: arc.path.media+'m',
			};

			this.clusterer = new MarkerClusterer(this.map, this.markers, options);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.listings !== this.props.listings) {
			this.setMarkers(nextProps.listings);
		}
	}
	shouldComponentUpdate() {
		return false;
	}
	render() {
		return (
			<div ref={c => this._mapEl = c} className='ListingsMap'/>
		);
	}
}
