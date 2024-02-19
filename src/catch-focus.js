module.exports = function(node, attr){
	var activeElement = null;
	node = node || window;
	attr = attr || 'data-has-focus';

	// Show focus outline for keyboard navigation (e.g. tab)
	function handler(event) {
		if (event.which === 9) {
			if (activeElement !== document.activeElement) {
				if (activeElement) {
					activeElement.removeAttribute(attr);
				}
				if (document.activeElement) {
					activeElement = document.activeElement;
					activeElement.setAttribute(attr, true);
				}
			}
		}
	}

	node.addEventListener('keyup', handler);

	return function() {
		node.removeEventListener('keyup', handler);
	}
};