import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import RouteMeta from './components/RouteMeta'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Domains from './pages/Domains'
import Hosting from './pages/Hosting'
import WebDevelopment from './pages/WebDevelopment'
import AiConsulting from './pages/AiConsulting'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <Router>
      <RouteMeta />
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/hosting" element={<Hosting />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/ai-consulting" element={<AiConsulting />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
