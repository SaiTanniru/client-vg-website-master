module.exports = (config, manifest, version)=>{
	return `<!doctype html>
<html lang='en'>
	<meta charset='utf-8'>
	<meta name='viewport' content='width=device-width, initial-scale=1.0'>
	<title>STRIVE | Commercial Real Estate Advisors</title>
	<link rel='shortcut icon' type='image/png' href='${config.path.media}favicon.png'>
	<link rel='preconnect' href='${config.path.api}' crossorigin>
	<link rel='dns-prefetch' href='${config.path.api}'>
	<link rel='preconnect' href='${config.path.media}' crossorigin>
	<link rel='dns-prefetch' href='${config.path.media}'>
	<body>
		<script>
			window.arc = ${JSON.stringify(config)};
		</script>
		<script src='//maps.googleapis.com/maps/api/js?key=AIzaSyAidC_8UotCx2xCrFseHFVDd8SMZifhin4'></script>
		<script defer src="${manifest['vendors.js']}"></script>
		<script defer src="${manifest['runtime.js']}"></script>
		<script defer src="${manifest['app.js']}"></script>
		<script>
			// SPA Pageview Tracking
			document.body.addEventListener('onStateChange', function(e) {
				var state = e.detail.state;
				var prevState = e.detail.prevState;

				if (!prevState.location || prevState.location.href !== state.location.href) {
					// Timeout to give the title time to be set
					setTimeout(function() {
						if (window.ga) {
							window.ga('send', {
								hitType: 'pageview',
								title: document.title,
								location: state.location.href,
								page: state.location.pathname+state.location.search,
							});
						}			
					}, 1);
				}
			});

			// Google Analytics
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-114067500-1', 'auto');
		</script>
	</body>
</html>
	`;
}