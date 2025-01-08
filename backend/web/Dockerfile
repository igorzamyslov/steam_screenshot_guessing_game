FROM python:3.12-slim as base
ARG SERVICE=web

# Setup environment
FROM base AS python-deps
# Install pipenv and compilation dependencies
RUN pip install pipenv
# Install python dependencies in /.venv
COPY ./backend/${SERVICE}/Pipfile ./backend/${SERVICE}/Pipfile.lock ./
ENV PIPENV_VENV_IN_PROJECT=1
RUN pipenv install --deploy


# Setup runtime
FROM base AS runtime
# Copy virtual env from python-deps stage
COPY --from=python-deps /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

WORKDIR /app
COPY ./backend/common ./common
COPY ./backend/${SERVICE} ./${SERVICE}
ENV SERVICE=${SERVICE}
CMD ["uvicorn", "web.app:app", "--host", "0.0.0.0", "--port", "80", "--log-level", "debug"]
