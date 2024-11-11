# Database Component

## Requirements:

- Linux/MacOS
- Conda
- Docker Desktop

## Setup:

Docker Containers:

1. Inside `docker_db`, run `docker compose up`. 
2. Access pgadmin at `http://localhost:8080` and login with:
    - Email: admin@admin.com
    - Password: password
3. Add a new server with the following information:
    - General:
        - Name: prosperiti
    - Connection:
        - Host name/address: pgvector
        - Password: password

Python Development:

1. Make `install.sh` executable and run it.