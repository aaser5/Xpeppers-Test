import React from 'react';
import './App.css';
import {Route, Router, Switch} from "react-router-dom";
import SalesTaxScreen from 'scenes/app';
import history from "services/history";
function App() {
  return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" render={(props) => (<SalesTaxScreen  {...props} />)}/>
        </Switch>
      </Router>
  );
}

export default App;
