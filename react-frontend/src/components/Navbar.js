import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

function Navbar() {
  const location = useLocation();

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          🎤 Conference Manager
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
            >
              🏠 Accueil
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/conferences"
              active={location.pathname.startsWith('/conferences')}
            >
              📅 Conférences
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/keynotes"
              active={location.pathname.startsWith('/keynotes')}
            >
              👤 Keynotes
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link disabled className="text-muted">
              Gateway: localhost:9999
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;

