import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import React, { Suspense, lazy } from "react";

const Streamers = lazy(() => import('./components/streamers'));
const Streamerdetails = lazy(() => import('./components/streamer'));

function App() {
  return (
    <div className="App">
      <div>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Streamers}></Route>
            <Route exact path="/streamer/:twitchname" component={Streamerdetails}></Route>
          </Switch>
        </Suspense>
      </Router>
      </div>
    </div>
  );
}

export default App;
