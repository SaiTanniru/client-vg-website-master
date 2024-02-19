import React from 'react';
import Icon from '../Icon';
import svgChevronLeft from '../../svgs/chevron-left.svg';
import svgChevronRight from '../../svgs/chevron-right.svg';
import Slider from '../Slider/Slider';

export default class extends Slider {
	render() {
		const { slides } = this.props;
		const { index } = this.state;

		return (
			<div className='Slider'>
				<button type='button' className='Slider_btn Slider_btn--prev' aria-label='Previous' onClick={this.prev}>
					<Icon svg={svgChevronLeft}/>
				</button>
				<div className='Slider_slides'>
					{
						slides.map((el, i) => <div key={i} className={'Slider_slides_item'+(i===index ? ' Slider_slides_item--active' : '')} style={{transform: `translate3d(${-i*100}%,0,0)`}}>{el}</div>)
					}
				</div>
				<button type='button' className='Slider_btn Slider_btn--next' aria-label='Next' onClick={this.next}>
					<Icon svg={svgChevronRight}/>
				</button>
			</div>
		);
	}
}