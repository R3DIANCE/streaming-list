import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import React, { Suspense, lazy } from "react";

const Login = lazy(() => import('./components/login'));
const Logout = lazy(() => import('./components/logout'));
const Streamers = lazy(() => import('./components/streamers'));
const Streamerdetails = lazy(() => import('./components/streamer'));
const Privacy = lazy(() => import('./components/privacypolicy'));
const Settings = lazy(() => import('./components/settings'));
const Stats = lazy(() => import('./components/stats'));

function App() {
  return (
    <div className="App">
      <div>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Streamers}></Route>
            <Route exact path="/streamer/:twitchname/:id" component={Streamerdetails}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/logout" component={Logout}></Route>
            <Route exact path="/privacy" component={Privacy}></Route>
            <Route exact path="/settings" component={Settings}></Route>
            <Route exact path="/stats" component={Stats}></Route>
          </Switch>
        </Suspense>
      </Router>
      </div>
    </div>
  );
}

export default App;
