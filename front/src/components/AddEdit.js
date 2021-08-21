import { useState } from "react";
import { CardGroup, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { getMovies, addMovies, updateMovie, deleteMovie } from "../utils/api.js";

const AddEdit = () => {
    const [ searchParam, setSearchParam ] = useState("");
    const [ pending, setPending ] = useState(false);
    const [ create_title, setCTitle ] = useState("");
    const [ create_year, setCYear ] = useState("");
    const [ create_genre, setCGenre ] = useState("");
    const [ create_director, setCDirector ] = useState("");
    const [ found_movie, setFoundMovie ] = useState(null);
    const [ update_year, setUYear ] = useState("");
    const [ update_genre, setUGenre ] = useState("");
    const [ update_director, setUDirector ] = useState("");
    const [ createStatus, setCStatus ] = useState(null);
    const [ editStatus, setEStatus ] = useState(null);

    const resetSearch = () => {
        setSearchParam("");
        setFoundMovie(null);
        setUYear("");
        setUGenre("");
        setUDirector("");
    }

    const handleCreate = e => {
        e.preventDefault();

        const movieData = [ { title: create_title } ]

        if (!!create_year) movieData[0].year = create_year;
        if (!!create_genre) movieData[0].genre = create_genre;
        if (!!create_director) movieData[0].director = create_director;

        setPending(true);
        addMovies(movieData)
            .then(responseStatus => setCStatus(responseStatus))
            .catch(errorStatus => setCStatus(errorStatus))
            .finally(() => {
                resetSearch();
                setPending(false);
            });
    }

    const handleSearch = e => {
        e.preventDefault();

        if (!!searchParam) {
            setPending(true);
            getMovies(searchParam)
                .then(response => {
                    const movie = response.items[0];
                    
                    if (!!movie) {   
                        setEStatus(null)                 
                        setFoundMovie(movie);
                        setUYear(movie.year || "");
                        setUGenre(movie.genre || "");
                        setUDirector(movie.director || "");
                    }
                    else {
                        setFoundMovie(null);
                        setEStatus(404)
                    }
                })
                .catch(errorStatus => setEStatus(errorStatus))
                .finally(() => setPending(false));
        }
    }
    
    const handleUpdate = e => {
        e.preventDefault();

        const movieData = {}

        if (!!update_year) movieData.year = update_year;
        if (!!update_genre) movieData.genre = update_genre;
        if (!!update_director) movieData.director = update_director;

        setPending(true);
        updateMovie(found_movie.title, movieData)
            .then(responseStatus => setEStatus(responseStatus))
            .catch(errorStatus => setEStatus(errorStatus))
            .finally(() => {
                resetSearch();
                setPending(false);
            });
    }
        
    const handleDelete = e => {
        e.preventDefault();

        setPending(true);
        deleteMovie(found_movie.title)
            .then(responseStatus => setEStatus(responseStatus))
            .catch(errorStatus => setEStatus(errorStatus))
            .finally(() => {
                resetSearch();
                setPending(false);
            });
    }


    return (
        <div className="content">
            <div className="content-heading">
                <h2>Edite la colección</h2>
                <h4>Agregue, actualice o elimine películas de la colección</h4>
            </div>
            <CardGroup>
                <Card>
                    <Card.Header as="h5">Agregar Películas</Card.Header>
                    <Card.Body>
                    <Card.Text>Agregue una nueva película llenando los campos</Card.Text>
                    <Form onSubmit={handleCreate}>
                        <Form.Group className="mb-3" controlId="searchMovie">
                            <Form.Label>Título</Form.Label>
                            <Form.Control type="text" value={create_title} onChange={e => setCTitle(e.target.value) } />
                            <Form.Label>Año</Form.Label>
                            <Form.Control type="text" value={create_year} onChange={e => setCYear(e.target.value)} />
                            <Form.Label>Género</Form.Label>
                            <Form.Control type="text" value={create_genre} onChange={e => setCGenre(e.target.value)} />
                            <Form.Label>Director</Form.Label>
                            <Form.Control type="text" value={create_director} onChange={e => setCDirector(e.target.value)} />
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={ !create_title }>Crear Película</Button>
                    </Form>
                    {
                        !!createStatus ?
                            <Alert variant={ createStatus >= 500 ? "danger" : createStatus >= 400 ? "warning" : "success" }>
                                {
                                    createStatus >= 500 ? "Ha habido un error. Inténtelo nuevamente mas tarde."
                                    : createStatus >= 400 ? "Hubo un problema con los datos envíados. Verifique que sean correctos e intente nuevamente."
                                    : "La operación fue exitosa"
                                }
                            </Alert>
                        : null
                    }
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Header as="h5">Actualizar / Eliminar</Card.Header>
                    <Card.Body>
                    <Form className="search-form" onSubmit={handleSearch}>
                        <Form.Group controlId="searchMovie">
                            <Form.Label>Buscar película</Form.Label>
                            <Form.Control type="text" value={searchParam} placeholder="Escriba el título" onChange={e => setSearchParam(e.target.value)} />
                        </Form.Group>
                        <Button type="submit" variant="primary" disabled={pending || !searchParam }>Buscar</Button>
                    </Form>
                    { 
                        !!found_movie ?
                            <Form>
                                <Form.Group className="mb-3" controlId="searchMovie">
                                    <Form.Label>Título</Form.Label>
                                    <Form.Control type="text" value={found_movie.title} readOnly />
                                    <Form.Label>Año</Form.Label>
                                    <Form.Control type="text" value={update_year} onChange={e => setUYear(e.target.value) } />
                                    <Form.Label>Género</Form.Label>
                                    <Form.Control type="text" value={update_genre} onChange={e => setUGenre(e.target.value) } />
                                    <Form.Label>Director</Form.Label>
                                    <Form.Control type="text" value={update_director} onChange={e => setUDirector(e.target.value) } />
                                </Form.Group>
                            </Form>
                        : null
                    }
                    {
                        !!editStatus ?
                            <Alert variant={ editStatus >= 500 ? "danger" : editStatus === 404 ? "info" : editStatus >= 400 ? "warning" : "success" }>
                                {
                                    editStatus >= 500 ? "Ha habido un error. Inténtelo nuevamente mas tarde."
                                    : editStatus === 404 ? "No se encontraron películas con ese título."
                                    : editStatus >= 400 ? "Hubo un problema con los datos envíados. Verifique que sean correctos e intente nuevamente."
                                    : "La operación fue exitosa"
                                }
                            </Alert>
                        : null
                    }
                    <Button variant="primary" disabled={ !found_movie } onClick={ e => handleUpdate(e) }>Actualizar</Button>
                    <Button variant="secondary" disabled={ !found_movie } onClick={ e => handleDelete(e) }>Eliminar</Button>
                    </Card.Body>
                </Card>
            </CardGroup>
            { pending ? <Spinner animation="border" variant="secondary" />  : null }
        </div>
    );
};

export default AddEdit;
