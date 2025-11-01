FROM astral/uv:python3.14-bookworm

COPY uv.lock ./app/
COPY .python-version ./app/
COPY pyproject.toml ./app/

WORKDIR /app

RUN uv sync

