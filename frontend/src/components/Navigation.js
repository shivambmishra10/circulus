// components/Navigation.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, Container, Nav, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { createContext, useContext, useEffect } from 'react';

// const AuthContext = createContext({
//   user: null,
//   isAuthenticated: false,
//   loading: true,
//   login: async () => {},
//   logout: () => {},
//   register: async () => {},
//   googleLogin: async () => {}
// });


const Navigation = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    router.push('/');
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm py-3">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand className="fw-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
              Circulus
            </Navbar.Brand>
          </Link>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Link href="/" passHref>
                <Nav.Link className={router.pathname === '/' ? 'active' : ''}>
                  Home
                </Nav.Link>
              </Link>
              
              <Link href="/trips/create" passHref>
                <Nav.Link className={router.pathname === '/trips/create' ? 'active' : ''}>
                  Create Trip
                </Nav.Link>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link href="/profile" passHref>
                    <Nav.Link className={router.pathname === '/profile' ? 'active' : ''}>
                      Profile
                    </Nav.Link>
                  </Link>
                  
                  {user.is_host && (
                    <Link href="/manage-requests" passHref>
                      <Nav.Link className={router.pathname === '/manage-requests' ? 'active' : ''}>
                        Requests
                      </Nav.Link>
                    </Link>
                  )}
                  
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="ms-2"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" passHref>
                    <Nav.Link className={router.pathname === '/login' ? 'active' : ''}>
                      Login
                    </Nav.Link>
                  </Link>
                  
                  <Link href="/register" passHref>
                    <Button variant="primary" size="sm" className="ms-2">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navigation;

