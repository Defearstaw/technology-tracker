import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import ApiSearch from './pages/ApiSearch';
import AddTechnologyForm from './components/AddTechnologyForm';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import useTechnologies from './hooks/useTechnologies';
import DataManagement from './pages/DataManagement';
import './App.css';

function App() {
  const { technologies } = useTechnologies();

  return (
    <div className="App">
      <Navigation />
      
      <main className="App-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technologies" element={<TechnologyList />} />
          <Route path="/technology/:id" element={<TechnologyDetail />} />
          <Route path="/api-search" element={<ApiSearch />} />
          <Route path="/add-technology" element={<AddTechnologyForm />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/data-management" element={<DataManagement />} />
        </Routes>
      </main>
      
      <footer className="App-footer">
        <p>Трекер изучения технологий • React Router • GitHub API • Всего технологий: {technologies.length}</p>
      </footer>
    </div>
  );
}

export default App;