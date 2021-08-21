import { useState, useEffect } from "react";
import { Form, Button, Table, Pagination, Alert, Spinner } from "react-bootstrap";
import { getMovies } from "../utils/api.js";

const Browse = () => {
    const [ searchParam, setSearchParam ] = useState("");
    const [ pending, setPending ] = useState(false);
    const [ movies, setMovies ] = useState(null);
    const [ status, setStatus ] = useState(false);
    const [ pages, setPages ] = useState(1);
    const [ pageActive, setPageActive ] = useState(1);
    const [ offset, setOffset ] = useState(0);
    const [ limit, setLimit ] = useState(0);

    const handleChangePage = (newPage) => {
        if (newPage >= 1 && newPage <= pages && !pending) {
            setOffset((newPage * limit) - limit);
            setPageActive(newPage);
        }
    }

    const loadPaginationItems = pages => {
        let items = [];

        for (let num = 1; num <= pages; num++) {
            items.push(
                <Pagination.Item key={num} active={num === pageActive} onClick={(e) => handleChangePage(num) }>
                    {num}
                </Pagination.Item>
            );
        }

        return items;
    }

    const handleSearch = e => {
        e.preventDefault();

        setOffset(0);
        getMoviesCall(searchParam);
    }

    const getMoviesCall = param => {
        let totalResults = 0,
            res_limit = 0,
            res_offset = 0;

        setPending(true);
        getMovies(param, offset)
            .then(response => {
                if (response.items.length > 0) {
                    totalResults = response.totalResults;
                    res_limit = response.limit;
                    res_offset = response.offset;

                    setMovies(response.items);
                    setPages(Math.ceil(totalResults / res_limit));
                    setPageActive((res_offset / res_limit) + 1);
                    setLimit(res_limit);
                }
                else setStatus(404)
            })
            .catch(errorStatus => setStatus(errorStatus))
            .finally(() => setPending(false));
    }

    useEffect(() => {
        getMoviesCall(searchParam, offset)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    return (
        <div className="content">
            <div className="content-heading">
                <h2>Colección de películas</h2>
                <h4>Consulte las películas del catálogo.</h4>
            </div>
            <Form className="search-form pos-right" onSubmit={handleSearch}>
                <Form.Group controlId="searchMovie">
                    <Form.Label>Buscar</Form.Label>
                    <Form.Control type="text" value={searchParam} placeholder="Escriba el título" onChange={e => setSearchParam(e.target.value)} />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={ pending }>Buscar</Button>
            </Form>
            {
                !!movies ?
                    <div className="movies-list">
                        <Table striped bordered hover>
                            <thead>
                                <tr>{ Object.keys(movies[0]).map(key =><th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>) }</tr>
                            </thead>
                            <tbody>
                                { movies.map((movie, i1) => <tr key={i1}>{ Object.values(movie).map((val, i2) => <td key={`${i1}.${i2}`}>{val}</td>) }</tr>) }
                            </tbody>
                        </Table>
                        { 
                            pages > 1 ?
                                <Pagination>
                                    <Pagination.Prev onClick={ e => handleChangePage(pageActive - 1) } />
                                    { loadPaginationItems(pages) }
                                    <Pagination.Next onClick={ e => handleChangePage(pageActive + 1) } />
                                </Pagination>
                            : null
                        }   
                    </div>
                : !!status ?
                    <Alert variant={ status === 404 ? "info" : "danger" }>
                        { status === 404 ? "No se encontraron películas." : "Ha ocurrido un error. Vuelva a intentarlo mas tarde" }
                    </Alert>
                : null
            }
            { pending ? <Spinner animation="border" variant="secondary" />  : null }
        </div>
    );
};

export default Browse;
