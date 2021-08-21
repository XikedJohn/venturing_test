const endpointBase = `http://localhost:8000/movies`,
      doApiCall = async (url, options) => {        
          const response = await fetch(url, options);
          const responseStatus = response.status;

          if (!response.ok) throw new Error(responseStatus)

          return responseStatus === 204 ? responseStatus : response.json();
      }

const getMovies = (pathParam, offset) => {
    const url = `${endpointBase}${!!pathParam ? `/${pathParam}` : ""}${!!offset ? `?offset=${offset}` : ""}`;

    return doApiCall(url);
}

const addMovies = moviesData => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moviesData)
    }

    return doApiCall(endpointBase, options);
}

const updateMovie = (title, movieData) => {
    const url = `${endpointBase}/${title}`,
          options = {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(movieData)
          }

    return doApiCall(url, options);
}

const deleteMovie = title => {
    const url = `${endpointBase}/${title}`,
          options = {  method: 'DELETE' }

    return doApiCall(url, options);
}

export { getMovies, addMovies, updateMovie, deleteMovie }