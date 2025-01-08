FROM python:3.12-slim as base
ARG SERVICE=steam_db_handler

# Setup environment
FROM base AS python-deps
# Install pipenv and compilation dependencies
RUN pip install pipenv
# Install python dependencies in /.venv
COPY ${SERVICE}/Pipfile ${SERVICE}/Pipfile.lock ./
ENV PIPENV_VENV_IN_PROJECT=1
RUN pipenv install --deploy

# Setup runtime
FROM base AS runtime
# Copy virtual env from python-deps stage
COPY --from=python-deps /.venv /.venv
ENV PATH="/.venv/bin:$PATH"
RUN playwright install --with-deps chromium

COPY common ./common
COPY ${SERVICE} ./main
CMD ["python", "-u", "-m", "main.app"]
