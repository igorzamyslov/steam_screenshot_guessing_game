# Backend services

## Services

The backend contains the following services:

- `database_migration` - migration of the database
- `steam_db_handler` - populating database with steam apps
- `web` - web-service to provide frontend with applications

## Docker build

Docker images must be built using `backend` folder as context

Example:

```shell
docker build -f web/Dockerfile .
```
