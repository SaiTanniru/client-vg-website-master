export default (value)=> {
	if (value === undefined || value === null || value === '') return '';

	const num = Number(value);

	// Check for NaN
	return (num !== num) ? '' : '$'+Math.round(num).toLocaleString();
}