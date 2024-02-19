import React from 'react';
import ResizeImg from '../ResizeImg';

export default class extends React.Component {
	static defaultProps = {
		bigSize: 660,
		thumbSize: 100,
	};
	state = {
		mainSrc: null,
		isLoading: null,
	};
	componentWillReceiveProps() {
		this.setState({
			mainSrc: null
		})
	}
	render() {
		const { photos, bigSize, thumbSize, address } = this.props;
		const bigSrc = this.state.mainSrc || (photos.length ? photos[0] : null);

		return (
			<div className='PropertyPhotos'>
				<div className='PropertyPhotos_big'>
					{
						bigSrc ? (
							<ResizeImg src={bigSrc} width={bigSize} resizeWidth={bigSize} onLoad={()=> { this.setState({isLoading: null}); }} alt=''/>
						) : address ? (
							<img src={`https://maps.googleapis.com/maps/api/streetview?size=${bigSize}x400&location=${encodeURI(address)}&key=AIzaSyAidC_8UotCx2xCrFseHFVDd8SMZifhin4`} alt=''/>
						) : (
							<div className='PropertyPhotos_no-photo'>
								<span>Photo unavailable</span>
							</div>
						)
					}
				</div>
				{
					photos.length > 1 ? (
						<div className='PropertyPhotos_thumbs'>
							{
								photos.map((src, i) => (
									<a key={i} href='#' onClick={(e)=> {
										e.preventDefault();

										if (src !== this.state.mainSrc) {
											this.setState({
												mainSrc: src,
												isLoading: src,
											});
										}
									}} data-is-busy={this.state.isLoading === src ? true : null}>
										<ResizeImg src={src} width={thumbSize} resizeWidth={thumbSize} alt=''/>
									</a>
								))
							}
						</div>
					) : null
				}
			</div>
		);
	}
}