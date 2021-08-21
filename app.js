import express from 'express';
import cors from 'cors';
import { getMovies, addMovies, updateMovie, deleteMovie } from './mysql_connector.js';
import { config } from './config.js';

const app = express(),
      server_config = config.server.connection,
      cors_origins = { origin: config.server.cors.whitelist },
      db_table = config.database.table,
      db_primKey = db_table.primary_key,
      api_resource = config.api.resource,
      handleInvalidReq = (response, resMessage) => response.status(400).send(`Invalid Request: ${resMessage}`),
      handleResError = (error, response) => {
          const sqlError = !!error.sql,
                errorToSend = {
                    status: sqlError ? 400 : !!error.status && error.status >= 400 ? error.status : 500,
                    message: sqlError ? error.sqlMessage : !!error.message ? error.message : error
                }

          console.log(error);
          response.status(errorToSend.status).send(JSON.stringify(errorToSend));
      },
      processData = dataObj => {
          let dataObjKeys = Object.keys(dataObj);

          const db_fields = db_table.fields,
                notFoundKeys = dataObjKeys.filter(key => !db_fields.filter(field => field.name === key)[0]);

          if (notFoundKeys.length > 0) {
              notFoundKeys.forEach(key => delete dataObj[key]);
              dataObjKeys = Object.keys(dataObj);
          }

          if (dataObjKeys.length > 0) {
              for (let i = 0; i < dataObjKeys.length; i++) {
                  const currentKey = dataObjKeys[i],
                        currentValue = dataObj[currentKey],
                        dataType = db_fields.filter(field => field.name === currentKey)[0].type;

                  if (typeof currentValue !== dataType) {
                      dataObj = {
                          error: true,
                          errorMessage: `The data type of the property \"${currentKey}\" must be \"${dataType}\".`
                      }

                      break;
                  }
              }
          }

          return dataObj;
      }

app.use(cors());
app.use(express.json());
app.listen(server_config.port, () => console.log(`Server listening to port ${server_config.port}`));

// Lists all movies from the DB or a particular by the title
app.get(`/${api_resource}/:${db_primKey}?`, cors(cors_origins), (req, res) => {
    try { getMovies(req.params[db_primKey] || null, req.query.offset).then(movies => res.send(movies)).catch(error => handleResError(error, res)) }
    catch(error) { handleResError(error, res) }
});

// Adds any amount of movies from an array of objects received in the request
app.post(`/${api_resource}`, cors(cors_origins), (req, res) => {
    try {
        let moviesList = [];
        
        for (let i = 0; i < req.body.length; i++) {
            const currentItem = processData(req.body[i]);

            if (!currentItem.error) moviesList.push(currentItem);
            else {
                moviesList = currentItem;
                break;
            }
        }

        if (!!moviesList && !!moviesList.error) handleInvalidReq(res, moviesList.errorMessage);
        else if (!!moviesList && Array.isArray(moviesList) && !moviesList.filter(movie => typeof movie !== "object")[0]) {
            if (!moviesList.filter(movie => !movie[db_primKey])[0]) addMovies(req.body).then(result => res.status(204).send()).catch(error => handleResError(error, res));
            else handleInvalidReq(res, "Movies must have title to be created.");
        }
        else handleInvalidReq(res, "List of movies to create nonexistent or invalid.");
    }
    catch(error) { handleResError(error, res) }
});

// Updates a movie from the catalog by the title
// Using optional parameter to handle invalid request message
app.put(`/${api_resource}/:${db_primKey}?`, cors(cors_origins), (req, res) => {
    try {
        const movieData = {
                  title: req.params.title,
                  dataToUpdate: processData(req.body, res)
              },
              validData = !!movieData.dataToUpdate && !movieData.dataToUpdate.error && typeof movieData.dataToUpdate === "object" && !Array.isArray(movieData.dataToUpdate) && Object.keys(movieData.dataToUpdate).length > 0;

        if (!!movieData.title && validData) updateMovie(movieData).then(result => res.status(204).send()).catch(error => handleResError(error, res));
        else if (!!movieData.dataToUpdate.error) handleInvalidReq(res, movieData.dataToUpdate.errorMessage);
        else if (!movieData.title) handleInvalidReq(res, "Movie to update not specified.");
        else handleInvalidReq(res, "Movie data for update nonexistent or invalid.");
    }
    catch(error) { handleResError(error, res) }
});

// Deletes a movie from the catalog by the title
// Using optional parameter to handle invalid request message
app.delete(`/${api_resource}/:${db_primKey}?`, cors(cors_origins), (req, res) => {
    try {
        const movieToDelete = req.params.title;

        if (!!movieToDelete) deleteMovie(movieToDelete).then(result => res.status(204).send()).catch(error => handleResError(error, res));
        else handleInvalidReq(res, "Movie to delete not specified.");
    }
    catch(error) { handleResError(error, res) }
});