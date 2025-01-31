# Use a lightweight Python base image
FROM python:3.9-slim

# Define arguments for the database
ARG PG_USER
ARG PG_PWD
ARG PG_DB
ARG PG_PORT

# Install Postgres and supervisor
RUN apt-get update && apt-get install -y \
    postgresql-15 \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copy your application code into /app
WORKDIR /app
COPY app.py /app/

# Set environment variables for Postgres
ENV POSTGRES_USER=$PG_USER
ENV POSTGRES_PASSWORD=$PG_PWD
ENV POSTGRES_DB=$PG_DB
ENV POSTGRES_PORT=$PG_PORT

# Create Postgres data directory (not declared as a volume)
RUN mkdir -p /var/lib/postgresql/data \
    && chown -R postgres:postgres /var/lib/postgresql

# Copy the supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the Flask port (5000) and Postgres port (5432)
EXPOSE 5000 $PG_PORT

# Switch to the postgres user to initialize the DB
USER $PG_USER

# Initialize the database cluster & create DB
RUN /usr/lib/postgresql/15/bin/initdb -D /var/lib/postgresql/data

# Make sure these .sql files are in the same directory as your Dockerfile

COPY backend/sql/ /scripts/

RUN service postgresql start \ 
&& psql -U $PG_USER -p $PG_PORT -d postgres -c "CREATE DATABASE $PG_DB" \
&& psql -U $PG_USER -p $PG_PORT -d $PG_DB -f /scripts/users_ddl.sql \
&& psql -U $PG_USER -p $PG_PORT -d $PG_DB -f /scripts/logs_ddl.sql
#&& psql -U postgres -d ptt_db -f /scripts/student_info.sql \

# Switch back to root so supervisor can manage processes
USER root

# Command to start supervisor (which starts both Postgres and Flask)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

