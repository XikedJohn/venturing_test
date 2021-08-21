import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { addMovies } from "../utils/api.js";
import Papa from 'papaparse';

const Upload = () => {
    const [ file, setFile ] = useState(null);
    const [ pending, setPending ] = useState(false);
    const [ status, setStatus ] = useState(null);
    
    const handleUpload = e => {
        e.preventDefault()

        if (!!file) {
            Papa.parse(file, {
                header: true,
                complete: function(results) {
                    setPending(true);
                    addMovies(results.data)
                        .then(responseStatus => setStatus(responseStatus))
                        .catch(error => setStatus(parseInt(error.message)))
                        .finally(() => setPending(false));
                }
            });
        }
    } 

    return (
        <div className="content">
            <div className="content-heading">
                <h2>Subir archivo CSV</h2>
                <h4>Agregue películas a la colección a través de un archivo formato CSV.</h4>
            </div>
            <Form className="upload-form" onSubmit={handleUpload}>
                <Form.Group controlId="formFile">
                    <Form.Label className="btn btn-secondary">Subir CSV</Form.Label>
                    <Form.Control type="file" accept=".csv" onChange={ e => { setStatus(null); setFile(e.target.files[0]) } }/>
                    {
                        !!file ? <span>{file.name}</span> : <span>No se eligió ningún archivo</span>
                    }
                </Form.Group>
                <Button type="submit" variant="primary" disabled={pending || !file }>Subir Archivo</Button>
            </Form>
            {
                !!status ?
                    <Alert variant={ status >= 500 ? "danger" : status >= 400 ? "warning" : "success" }>
                        {
                            status >= 500 ? "Ha habido un error. Inténtelo nuevamente mas tarde."
                            : status >= 400 ? "Hubo un problema con los datos envíados. Verifique que sean correctos e intente nuevamente."
                            : "Carga realizada exitosamente. Ya puede ver las películas en la colección."
                        }
                    </Alert>
                : null
            }
            { pending ? <Spinner animation="border" variant="secondary" />  : null }
        </div>
    );
};

export default Upload;
