import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Navbar bg="primary" variant="dark">
            <Container className="justify-content-between">
                <Navbar.Brand as={Link} to="/">Catálogo de películas</Navbar.Brand>
                <Nav>
                    <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                    <Nav.Link as={Link} to="/upload">Subir CSV</Nav.Link>
                    <Nav.Link as={Link} to="/browse">Collección</Nav.Link>
                    <Nav.Link as={Link} to="/addedit">Editar</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
