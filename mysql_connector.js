import mysql from 'mysql';
import { config } from './config.js';

// DB connection setup
const db_config = config.database,
      db_connection = db_config.connection,
      db_table = db_config.table,
      connector = mysql.createConnection({
          host: db_connection.host,
          port: db_connection.port,
          user: db_connection.user,
          password: db_connection.password,
          database: db_config.name
      });

// Function to do every SQL query
const doQuery = query => {
    return new Promise((resolve, reject) => connector.query(query, (error, result, field) => error ? reject(error) : resolve(result)));
}

// Setting values trimmed or as null if it isn't passed
const setValue = val => !!(val || "").trim() ? `\"${val.trim()}\"` : "null";

// CREATE
const addMovies = moviesList => {
    const db_fields = db_table.fields,
          queryValues = moviesList.map(movie => `(${db_fields.map(field => setValue(movie[field.name])).join(",")})`).join(",");

    return doQuery(`INSERT INTO ${db_table.name} (${db_fields.map(field => field.name).join(",")}) VALUES ${queryValues}`);
}

// READ
const getMovies = (title, offset) => {
    const queryFragment = `${db_table.name}${!!title ? ` WHERE ${db_table.primary_key} LIKE \"${title}%\"` : ""}`;

    let movies = {
        totalResults: 0,
        offset: parseInt(offset) || 0,
        limit: db_table.select_limit,
        items: []
    }

    return doQuery(`SELECT * FROM ${queryFragment}${!!db_table.select_limit ? ` LIMIT ${db_table.select_limit}` : ""}${!!offset ? ` OFFSET ${offset}` : ""}`)
        .then(result => {
            movies.items = result;
            
            return doQuery(`SELECT COUNT(*) FROM ${queryFragment}`);
        })
        .then(result => {
            movies.totalResults = result[0]["COUNT(*)"];

            return movies;
        })
        .catch(error => error);
}

// UPDATE
const updateMovie = movieData => {
    const dataToUpdate = movieData.dataToUpdate,
          queryValues = Object.keys(dataToUpdate).map(key => `${key} = ${setValue(dataToUpdate[key])}`).join(",");

    return doQuery(`UPDATE ${db_table.name} SET ${queryValues} WHERE ${db_table.primary_key} = \"${movieData.title}\"`);
}

// DELETE
const deleteMovie = title => doQuery(`DELETE FROM ${db_table.name} WHERE ${db_table.primary_key} = \"${title}\"`);

export { getMovies, addMovies, updateMovie, deleteMovie }