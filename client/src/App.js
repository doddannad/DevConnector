import { Fragment } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilesPage from "./pages/ProfilesPage";
import ProfilePage from "./pages/ProfilePage";
import Error from "./components/Error";

const App = () => {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" exact Component={LandingPage} />
        </Routes>
        <section className="container">
          <Error />
          <Routes>
            <Route path="/register" exact Component={RegisterPage} />
            <Route path="/login" exact Component={LoginPage} />
            <Route path="/profiles" exact Component={ProfilesPage} />
            <Route path="/profile" Component={ProfilePage} />
          </Routes>
        </section>
      </>
    </Router>
  );
};

export default App;
