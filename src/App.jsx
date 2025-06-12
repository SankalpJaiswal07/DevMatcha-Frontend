import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Layout from "./components/Layout";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Signup from "./components/Signup";
import appStore, { persistor } from "./utils/appStore";

function App() {
  return (
    <Provider store={appStore}>
      <PersistGate
        loading={
          <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="mt-4 text-primary font-medium">
                Loading your data...
              </p>
            </div>
          </div>
        }
        persistor={persistor}
      >
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
