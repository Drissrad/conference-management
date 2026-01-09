import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ConferenceList from './pages/ConferenceList';
import ConferenceDetail from './pages/ConferenceDetail';
import ConferenceForm from './pages/ConferenceForm';
import KeynoteList from './pages/KeynoteList';
import KeynoteForm from './pages/KeynoteForm';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conferences" element={<ConferenceList />} />
          <Route path="/conferences/new" element={<ConferenceForm />} />
          <Route path="/conferences/edit/:id" element={<ConferenceForm />} />
          <Route path="/conferences/:id" element={<ConferenceDetail />} />
          <Route path="/keynotes" element={<KeynoteList />} />
          <Route path="/keynotes/new" element={<KeynoteForm />} />
          <Route path="/keynotes/edit/:id" element={<KeynoteForm />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

