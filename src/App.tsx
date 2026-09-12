import { HashRouter, Routes, Route } from "react-router-dom";
import { AppStoreProvider } from "./store/AppStore";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AppStoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStoreProvider>
  );
}

export default App;
