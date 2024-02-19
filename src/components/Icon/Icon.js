import React from 'react';

export default ({svg, className, ...rest})=> (
	<span {...rest} className={'Icon'+(className ? ' '+className : '')} aria-hidden='true' dangerouslySetInnerHTML={{__html: svg}}/>
);