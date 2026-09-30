import { Link, Route, Routes } from "react-router";

import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <h1>Failsafe</h1>
              <Link to="/login">Log in</Link>
              <Link to="/register">Create account</Link>
            </main>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
