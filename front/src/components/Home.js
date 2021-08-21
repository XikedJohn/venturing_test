import { Jumbotron, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="content">
            <Jumbotron className="justify-content-center">
                <div className="content-heading">
                    <h2>Colección de películas</h2>
                    <h4>Bienvenido a colección de películas. Aquí podrás subir y editar tus películas favoritas.</h4>
                    <Button as={Link} to="/browse" variant="primary" size="lg">
                        Ver colección
                    </Button>
                </div>
            </Jumbotron>
        </div>
    );
};

export default Home;
