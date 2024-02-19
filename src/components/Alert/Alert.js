import React from 'react';

export default ({type, children}) => (
	<span className={'Alert Alert--'+type}>{children}</span>
);