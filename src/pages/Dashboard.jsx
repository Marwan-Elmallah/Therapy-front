import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

const Dashboard = () => {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/dashboard">
                        Dashboard
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/dashboard/users">
                                Users
                            </Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/materials">
                                Materials
                            </Nav.Link>
                            <Nav.Link as={Link} to="/dashboard/invitations">
                                Invitations
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="mt-4">
                <Outlet />
            </Container>
        </div>
    );
};

export default Dashboard;