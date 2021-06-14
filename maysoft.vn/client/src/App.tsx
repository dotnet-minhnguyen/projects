import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import './App.css'

const Header = lazy(() => import('./layout/Header'))
const Main = lazy(() => import('./layout/Main'))
const Footer = lazy(() => import('./layout/Footer'))

export default class App extends React.Component {

    render() {
        return (
            <Router>
                <Suspense fallback={<>Loading...</>}>
                    <Header />
                    <Switch>
                        <Route exact path="/" component={Main}/>
                        <Route path="/about" component={Main}/>
                    </Switch>
                    <Footer />
                </Suspense>
            </Router>
        )
    }
}