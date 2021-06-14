import React from 'react'

import './index.css'
import './styles/main.scss'
import App from './App'
import ReactDOM from 'react-dom'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import appInfo from './../package.json'

const version = `MAYSOFT COMPANY LIMITED\n© 2013-2021 MAYSOFT, All rights reserved.\nVersion ${appInfo.version}`
console.log(version)

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
