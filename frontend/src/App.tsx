import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Container } from './components/shared/Container'
import { Navbar } from './components/shared/Navbar';
import { SellOrders } from './pages/SellOrders';

const App: React.FC = () => {
  return <Router>
    <Navbar />
    <Container>
      <Switch>
        <Route path="/" component={SellOrders} />
      </Switch>
    </Container>
  </Router>
}

export default App;
