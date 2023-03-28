# 1
FROM python:3.10

# 2
RUN pip install Flask gunicorn

# 4
COPY ./app
WORKDIR /app

# 4
ENV PORT 8080

# 5
CMD exec guincorn --bind :$PORT --workers 1 --threads 8 app:app