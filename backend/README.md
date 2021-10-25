# Services

The backend contains the following services:

- `alembic` - migration of the database
- `database_handler` - populating database with steam apps
- `web` - web-service to provide frontend with applications

# Build

Docker images must be built using `backend` folder as context

Example:

```
docker build -f web/Dockerfile .
```
