import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import React, { Suspense, lazy } from "react";

import './styles/html.module.css';

const Servers = lazy(() => import('./components/servers'));

function App() {
  return (
    <div className="App">
      <div>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Servers}></Route>
          </Switch>
        </Suspense>
      </Router>
      </div>
    </div>
  );
}

export default App;
