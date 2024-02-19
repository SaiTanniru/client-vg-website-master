import React from 'react';
import Scribe from 'scribe-editor';
// import sanitizer from 'scribe-plugin-sanitizer';
import toolbar from 'scribe-plugin-toolbar';
import convertToSemantic from 'scribe-plugin-formatter-html-ensure-semantic-elements';
import newlinesToHTML from 'scribe-plugin-formatter-plain-text-convert-new-lines-to-html';
import smartLists from 'scribe-plugin-smart-lists';
import headingCmd from 'scribe-plugin-heading-command';
import linkCmd from 'scribe-plugin-link-prompt-command';
import unlinkCmd from 'scribe-plugin-intelligent-unlink-command';
import blockquoteCmd from 'scribe-plugin-blockquote-command';
import imagePrompt from '../../scribe-plugin-img-prompt-command';
import whitelist from '../../whitelist';
import Icon from '../Icon';
import svgItalic from '../../svgs/italic.svg';
import svgStrikethrough from '../../svgs/strikethrough.svg';
import svgLink from '../../svgs/link.svg';
import svgUnlink from '../../svgs/unlink.svg';
import svgListUl from '../../svgs/list-ul.svg';
import svgListOl from '../../svgs/list-ol.svg';
import svgQuoteLeft from '../../svgs/quote-left.svg';
import svgPhoto from '../../svgs/photo.svg';

let set;

export default class extends React.Component {
	static defaultProps = { whitelist };

	init = (node)=>{
		if (!set) {
			set = new Set();
		}
		if (!set.has(node)) {
			set.add(node);

			const wl = this.props.whitelist;
			const scribe = new Scribe(node);

			if (wl.h1) {
				scribe.use(headingCmd(1));
			}
			if (wl.h2) {
				scribe.use(headingCmd(2));
			}
			if (wl.h3) {
				scribe.use(headingCmd(3));
			}
			if (wl.h4) {
				scribe.use(headingCmd(4));
			}
			if (wl.h5) {
				scribe.use(headingCmd(5));
			}
			if (wl.a) {
				scribe.use(linkCmd());
				scribe.use(unlinkCmd());
			}
			if (wl.ul) {
				scribe.use(smartLists());
			}
			if (wl.blockquote) {
				scribe.use(blockquoteCmd());
			}
			if (wl.img) {
				scribe.use(imagePrompt());
			}
			scribe.use(newlinesToHTML());
			scribe.use(convertToSemantic());
			scribe.use(toolbar(this._main));
		}
	};
	render() {
		const wl = this.props.whitelist;

		return (
			<div className='Editor' ref={c => this._main = c}>
				{
					wl.h1 ? <button type='button' className='Editor_btn tooltip'  data-command-name='h1' aria-label='Heading 1'>H1</button> : null
				}
				{
					wl.h2 ? <button type='button' className='Editor_btn tooltip'  data-command-name='h2' aria-label='Heading 2'>H2</button> : null
				}
				{
					wl.h3 ? <button type='button' className='Editor_btn tooltip'  data-command-name='h3' aria-label='Heading 3'>H3</button> : null
				}
				{
					wl.h4 ? <button type='button' className='Editor_btn tooltip'  data-command-name='h4' aria-label='Heading 4'>H4</button> : null
				}
				{
					wl.h5 ? <button type='button' className='Editor_btn tooltip'  data-command-name='h5' aria-label='Heading 5'>H5</button> : null
				}
				{
					wl.b ? <button type='button' className='Editor_btn tooltip'  data-command-name='bold' aria-label='Bold'>B</button> : null
				}
				{
					wl.i ? <button type='button' className='Editor_btn tooltip'  data-command-name='italic' aria-label='Italic'><Icon svg={svgItalic}/></button> : null
				}
				{
					wl.strike ? <button type='button' className='Editor_btn tooltip'  data-command-name='strikethrough' aria-label='Strikethrough'><Icon svg={svgStrikethrough}/></button> : null
				}
				{
					wl.a ? <button type='button' className='Editor_btn tooltip'  data-command-name='linkPrompt' aria-label='Insert/edit link'><Icon svg={svgLink}/></button> : null
				}
				{
					wl.a ? <button type='button' className='Editor_btn tooltip'  data-command-name='unlink' aria-label='Remove link'><Icon svg={svgUnlink}/></button> : null
				}
				{
					wl.ul ? <button type='button' className='Editor_btn tooltip'  data-command-name='insertUnorderedList' aria-label='Bulleted list'><Icon svg={svgListUl}/></button> : null
				}
				{
					wl.ul ? <button type='button' className='Editor_btn tooltip'  data-command-name='insertOrderedList' aria-label='Numbered list'><Icon svg={svgListOl}/></button> : null
				}
				{
					wl.ul ? <button type='button' className='Editor_btn tooltip'  data-command-name='blockquote' aria-label='Blockquote'><Icon svg={svgQuoteLeft}/></button> : null
				}
				{
					wl.img ? <button type='button' className='Editor_btn tooltip'  data-command-name='imagePrompt' aria-label='Insert image'><Icon svg={svgPhoto}/></button> : null
				}
				{
					wl.hr ? <button type='button' className='Editor_btn tooltip'  data-command-name='insertHorizontalRule' aria-label='Insert horizontal line'>---</button> : null
				}
				<button type='button' className='Editor_btn' onClick={this.props.onSave} data-is-busy={this.props.isSaving || null}>save</button>
			</div>
		);
	}
}