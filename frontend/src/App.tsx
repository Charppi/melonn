import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Container } from './components/shared/Container'
import { Navbar } from './components/shared/Navbar';
import { Details } from './pages/Details';
import { SellOrders } from './pages/SellOrders';

const App: React.FC = () => {
  return <Router>
    <Navbar />
    <Container>
      <Switch>
        <Route exact path="/" component={SellOrders} />
        <Route exact path="/:internalOrderNumber" component={Details} />
        <Route exact path="**" render={() => <Redirect to="/" />} />
      </Switch>
    </Container>
  </Router>
}

export default App;
