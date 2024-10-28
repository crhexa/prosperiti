# Database Component

## Requirements:

- Docker Desktop

## Setup:

1. Run `$ docker compose up`. 
2. Access pgadmin at `http://localhost:8080` and login with:
    - Email: admin@admin.com
    - Password: password
3. Add a new server with the following information:
    - General:
        - Name: prosperiti
    - Connection:
        - Host name/address: pgvector
        - Password: password
