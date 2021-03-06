import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { store, history } from '../redux/store'
import ReactGA from 'react-ga'
import * as Sentry from '@sentry/browser'

if(document.location.hostname !== 'localhost') {
	// production
	ReactGA.initialize('UA-120902510-1')
	ReactGA.pageview(window.location.pathname + window.location.search)
	
	history.listen((location, action) => {
		ReactGA.set({ page: location.pathname })
		ReactGA.pageview(location.pathname)
	})
	Sentry.init({
		dsn: 'https://718860c7f084473ab5d175647d6d74f3@sentry.io/1226318'
	})

	// TODO: this doesn't disable react devtools on frontend
	if((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
		;(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {}
	}
}

ReactDOM.render(
	<Provider store={store}>
		<App history={history} />
	</Provider>
, document.getElementById('root'))

if(module && (module as any).hot && (module as any).hot.accept) (module as any).hot.accept()