import { HashRouter, Routes, Route } from "react-router-dom";
import { AppStoreProvider } from "./store/AppStore";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddEntry from "./pages/AddEntry";
import EntryDetail from "./pages/EntryDetail";
import Folders from "./pages/Folders";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";

function App() {
  return (
    <AppStoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/add" element={<AddEntry />} />
            <Route path="/entry/:id" element={<EntryDetail />} />
            <Route path="/folders" element={<Folders />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStoreProvider>
  );
}

export default App;
