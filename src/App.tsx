import { HashRouter, Routes, Route } from "react-router-dom";
import { AppStoreProvider } from "./store/AppStore";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";

function App() {
  return (
    <AppStoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddEntry />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStoreProvider>
  );
}

export default App;
