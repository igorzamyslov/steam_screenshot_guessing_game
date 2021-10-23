FROM python:3-slim
WORKDIR /app
ARG service=web

COPY common/requirements.txt ./common_requirements.txt
COPY ${service}/requirements.txt ./main_requirements.txt
RUN pip install -r common_requirements.txt -r main_requirements.txt

COPY common ./common
COPY ${service} ./${service}
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]
