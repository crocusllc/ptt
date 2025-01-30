
import os
import csv
import io
import jwt
import datetime

from flask import Flask, request, jsonify, send_file
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.hash import bcrypt
from functools import wraps
from database_setup import setup_database  # Import database setup logic

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "SUPER-SECRET"

    # Set up DB engine
    engine = create_engine("postgresql+psycopg2://YOUR_USERNAME:YOUR_PASSWORD@YOUR_HOST:5433/YOUR_DBNAME", echo=False)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Initialize database tables and metadata
    metadata, users_table, student_table, field_list = setup_database(engine, session)

    # ========== AUTH DECORATOR ==========
    def login_required(role_required=None):
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                auth_header = request.headers.get('Authorization', None)
                if not auth_header or not auth_header.startswith("Bearer "):
                    return jsonify({"error": "Missing or invalid Authorization header"}), 401
                token = auth_header.split(" ")[1]
                try:
                    decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
                    request.user = decoded.get("sub")
                    request.user_role = decoded.get("role")
                    if role_required and request.user_role not in role_required:
                        return jsonify({"error": "Access denied"}), 403
                except jwt.ExpiredSignatureError:
                    return jsonify({"error": "Token expired"}), 401
                except jwt.InvalidTokenError:
                    return jsonify({"error": "Invalid token"}), 401
                return f(*args, **kwargs)
            return decorated_function
        return decorator

    # ========== LOGIN ENDPOINT ==========
    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json() or {}
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return jsonify({"error": "Missing username/password"}), 400

        user = session.execute(users_table.select().where(users_table.c.username == username)).fetchone()
        if not user:
            return jsonify({"error": "Invalid username or password"}), 401

        stored_hash = user[users_table.c.password_hash]
        if not bcrypt.verify(password, stored_hash):
            return jsonify({"error": "Invalid username or password"}), 401

        expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        token = jwt.encode(
            {
                "sub": username,
                "role": user[users_table.c.user_role],
                "exp": expiration
            },
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )
        cur = conn.cursor()
        cur.execute("SELECT version();")
        db_version = cur.fetchone()
        cur.close()
        conn.close()
        return f"Hello, World! PostgreSQL version: {db_version}"
    except Exception as e:
        return f"Error connecting to DB: {e}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

