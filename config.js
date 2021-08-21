const config = {
    server: {
        connection: {
            host: "localhost",
            port: "8000"
        },
        cors: {
            whitelist: [ "http://localhost:3000" ]
        }
    },
    database: {
        name: "movies_catalog",
        connection: {
            host: "localhost",
            port: "3306",
            user: "db_user",
            password: "db_pass"
        },        
        table: {
            name: "movies",
            primary_key: "title",
            fields: [ 
                {
                    name: "title",
                    type: "string"
                },
                {
                    name: "year",
                    type: "string"
                },
                {
                    name: "genre",
                    type: "string"
                },
                {
                    name: "director",
                    type: "string"
                }
            ],
            select_limit: 20
        }
    },
    api: {
        resource: "movies"
    }
}

export { config }