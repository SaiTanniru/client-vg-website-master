import React from 'react';
import Root from './components/Root';
import Page from './components/Page';
import Error404 from './components/Error404';
import Home from './components/Home';
import Team from './components/Team';
import History from './components/History';
import Property from './components/Property';
import News from './components/News';
import Contact from './components/Contact';
import Events from './components/Events';
import LoginPage from './components/LoginPage';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import JoinOurTeam from './components/JoinOurTeam';

const base = arc.path.base;

function setTitle(title = false) {
	document.title = 'STRIVE'+ (title ? ` | ${title}` : '');
}

export default {
	[base]: (params, props)=> {
		setTitle('Commercial Real Estate Advisors')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<Home isAdmin={props.isAdmin}/>
			</Root>
		)
	},
	[base+'our-team']: (params, props)=> {
		setTitle('Our Team')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<Team/>
				<Contact/>
			</Root>
		)
	},
	[base+'news']: (params, props)=> {
		setTitle('News')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<News/>
				<Contact/>
			</Root>
		)
	},
	[base+'listings/:mode?']: (params, props)=> {
		setTitle('Listings')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<History mode={params.mode || null} location={props.location}/>
			</Root>
		)
	},
	[base+'transaction-history']: (params, props)=> {
		window.location = arc.path.base+'listings/history';
	},
	[base+'property/:id']: (params, props)=> {
		setTitle('')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<Property location={props.location} id={params.id} isUser={props.isUser}/>
			</Root>
		)
	},
	[base+'contact']: (params, props)=> {
		setTitle('Contact Us')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<Contact/>
			</Root>
		)
	},
    [base+'join-our-team']: (params, props)=> {
        setTitle('Join Our Team')
        return (
            <Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
                <JoinOurTeam/>
            </Root>
        )
    },
	[base+'events/:id/:slug']: (params, props)=> {
		setTitle('Events')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<Events id={params.id}/>
				<Contact/>
			</Root>
		)
	},
	[base+'events']: (params, props)=> {
		setTitle('Events')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<Events/>
				<Contact/>
			</Root>
		)
	},
	// [base+'blog']: (params, props)=> {
	// 	setTitle('Blog')
	// 	return (
	// 		<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
	// 			<Blog/>
	// 			<Contact/>
	// 		</Root>
	// 	)
	// },
	// [base+'blog/:pageCode']: (params, props)=> {
	// 	return (
	// 		<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
	// 			<BlogPost pageCode={params.pageCode} isAdmin={props.isAdmin}/>
	// 			<Contact/>
	// 		</Root>
	// 	)
	// },
	[base+'login']: (params, props)=> {
		setTitle('Login')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<LoginPage/>
			</Root>
		)
	},
	[base+':pageCode']: (params, props)=> {
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<Page pageCode={params.pageCode} isAdmin={props.isAdmin}/>
				<Contact/>
			</Root>
		)
	},
	['*']: (params, props)=> {
		setTitle('Page Not Found')
		return (
			<Root pathname={props.location.pathname} isUser={props.isUser} login={props.login}>
				<Error404/>
			</Root>
		)
	},
};