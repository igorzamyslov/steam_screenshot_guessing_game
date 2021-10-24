FROM python:3-slim
WORKDIR /app
ARG SERVICE=alembic

COPY common/requirements.txt ./common_requirements.txt
COPY ${SERVICE}/requirements.txt ./main_requirements.txt
RUN pip install -r common_requirements.txt -r main_requirements.txt

COPY common ./common
COPY ${SERVICE} ./
CMD ["alembic", "upgrade", "head"]
