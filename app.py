import os
import csv
import io
import jwt
import datetime
import psycopg2
import json
import psycopg2.extras
from flask import Flask, request, jsonify, send_file, current_app
from flask_cors import CORS
from passlib.hash import bcrypt
from functools import wraps

def is_json(str):
  try:
    json.loads(str)
  except ValueError as e:
    return False
  return True

def create_conn():
    # Set up DB engine
    conn = psycopg2.connect(
        dbname="ptt_db",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432"
    )

    return conn

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["*"])

    # Set up DB engine
    app.config["SECRET_KEY"] = "SUPER_SECRET"

    @app.route('/')
    def hello():
        # Simple health check or DB connection check
        try:
            conn = create_conn()
            cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
            cur.execute("SELECT version();")
            db_version = cur.fetchone()
            cur.close()
            conn.close()
            return f"Hello, World! PostgreSQL version: {db_version}"
        except Exception as e:
            return f"Error connecting to DB: {e}"


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

        conn = create_conn()
        cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

        cur.execute("SELECT user_role, password_hash, username, new_password from users where username=%s;", (username,))
        user = cur.fetchone()

        cur.close()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid username or password"}), 401

        stored_hash = user['password_hash']

        if not bcrypt.verify(password, stored_hash):
            return jsonify({"error": "Invalid username or password"}), 401

        expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=10)
        token = jwt.encode(
            {
                "sub": username,
                "role": user['user_role'],
                "exp": expiration
            },
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        return jsonify({"token": token, "username": user['username'], "role": user['user_role'], "new_password": user['new_password']})

    # ========== CREATE USER ENDPOINT ==========
    @app.route("/create_user", methods=["POST"])
    def create_user():
        data = request.get_json() or {}
        username = data.get("username")
        password = data.get("password")
        useremail = data.get("user_email")
        userrole = data.get("user_role")

        if not username or not password or not useremail or not userrole:
            return jsonify({"error": "Missing fields"}), 400

        date_now = datetime.date.today()
        years_to_add = date_now.year + 5

        expiration_date = date_now.replace(year=years_to_add).strftime('%Y-%m-%d')

        bytes = password.encode("utf-8")
        hash = bcrypt.hash(bytes)
        
        conn = create_conn()
        cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

        query = f"INSERT INTO users (username, password_hash, user_email, password_expiration_date, user_role) VALUES ({username},{hash},{useremail},{expiration_date},{userrole});"
        cur.execute(query)
        
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": "The user was created successfully!"})

    # ========== CHANGE PASSWORD ENDPOINT ==========
    @app.route("/change_password", methods=["POST"])
    @login_required(role_required=["administrator", "editor","viewer"])
    def change_password():
        data = request.get_json() or {}
        password = data.get("password")
        auth_header = request.headers.get('Authorization', None)
       
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        user = decoded.get("sub")

        bytes = password.encode("utf-8")
        hash = bcrypt.hash(bytes)

        conn = create_conn()
        cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

        query = f"UPDATE users SET password_hash = {hash}, new_password = FALSE WHERE username = {user};"
        cur.execute(query)
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": "The username {user} set the password successfully!"})

    # ========== FILE UPLOAD ENDPOINT ==========
    @app.route("/file_upload", methods=["POST"])
    @login_required(role_required=["administrator", "editor"])
    def file_upload():
        data = request.get_data()
        json_str = data.decode('utf-8')
        json_objs = json_str.split('\n')

        for obj in json_objs:
            if is_json(obj):
                metadata = json.loads(obj)

        if (metadata):
            file_name = metadata["file_name"]
            table_name = metadata["table_name"]
            fields = metadata["fields"]
        
            file_content = request.files['file']

            if not file_name or not table_name or not fields or not file_content:
                return jsonify({"error": "Missing file_name, table_name, fields, or file"}), 400
        
            # Read file content
            stream = io.StringIO(file_content.stream.read().decode("utf-8"))
            csv_reader = csv.DictReader(stream)

            if table_name not in ["student_info", "program_info", "clinical_placements"]:
                return jsonify({"error": "Invalid table_name"}), 400

            rows_to_insert = []
            for row in csv_reader:
                row_data = {field: row[field] if row[field] != '' else None for field in fields if field in row}
                rows_to_insert.append(row_data)

            # Insert data using psycopg2
            try:
                if rows_to_insert:
            # Extract column names
                    columns = list(rows_to_insert[0].keys())
                    values = [[row[col] for col in columns] for row in rows_to_insert]
            
            # Build INSERT query dynamically
                    query = f"""
                    INSERT INTO {table_name} ({', '.join(columns)}) 
                    VALUES ({', '.join(['%s' for _ in columns])})
                    """
                    conn = create_conn()
                    cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)
            # Execute batch insert
                    for row in values:
                        cur.execute(query, row)
                
                    conn.commit()

                    cur.close()
                    conn.close()
            except psycopg2.Error as e:
                return jsonify({"message": f"Database error: {e}", "file_name": file_name, "table_name": table_name})

            return jsonify({"message": "File uploaded successfully", "file_name": file_name, "table_name": table_name})

    # ========== FILE DOWNLOAD ENDPOINT ==========
    @app.route("/file_download", methods=["POST"])
    @login_required(role_required=["administrator", "editor"])
    def file_download():
        data = request.get_json() or {}
        file_name = data.get("file_name")
        fields = data.get("fields", [])

        if not file_name or not fields:
            return jsonify({"error": "Missing file_name or fields"}), 400

        query_fields = ",".join(str(bit) for bit in fields)
        
        if query_fields == "":
             query_fields = "*"

        fields_not_date = fields.copy()

        start_date = ''
        end_date = ''
        exit_date = ''

        if query_fields != "*":
            for key in fields:
                if "date" in key:
                    fields_not_date.pop(key, None)

                    if "start" in key and fields[key] != '':
                        start_date = f'AND {key} >= \'{fields[key]}\'::date '

                    if "end" in key and fields[key] != '':
                        end_date = f'AND {key} <= \'{fields[key]}\'::date '

                    if "exit" in key and fields[key] != '':
                        exit_date = f'AND {key} <= \'{fields[key]}\'::date '

                if fields[key] == '':
                    fields_not_date.pop(key, None)

            conditions = ' AND '.join([f'lower({key}) like lower(\'%{fields_not_date[key]}%\')' for key in fields_not_date])

            query_all = f'SELECT * FROM student_info s JOIN clinical_placements c ON s.id=c.student_id JOIN program_info p ON s.id=p.student_id WHERE {conditions} {start_date} {end_date} {exit_date};'
            query_all = query_all.replace("WHERE AND", "WHERE")
        else:
            query_all = f'SELECT * FROM student_info s JOIN clinical_placements c ON s.id=c.student_id JOIN program_info p ON s.id=p.student_id;'

        conn = create_conn()
        cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

        cur.execute(query_all)
        results = cur.fetchall()

        cur.close()
        conn.close()

        if len(results) > 1:
            output = io.StringIO()
            writer = csv.writer(output)

            if fields == ["*"]:
                writer.writerow(results[0].keys())
            else:
                writer.writerow(fields)

            for row in results:
                if fields == ["*"]:
                    writer.writerow([row[field] for field in results[0].keys()])
                else:
                    writer.writerow([row[field] for field in fields])

            output.seek(0)
            return send_file(
                io.BytesIO(output.getvalue().encode("utf-8")),
                mimetype="text/csv",
                as_attachment=True,
                download_name=file_name
            )

        return jsonify({"message": "No data available"})

    # ========== UPDATE RECORD ENDPOINT ==========
    @app.route("/update_data", methods=["POST"])
    @login_required(role_required=["administrator", "editor"])
    def update_record():
        data = request.get_json() or {}

        if (data != {}):
            id = data.get("id")
            student_id = data.get("student_id")
            source = data.get("source")

            # Map source to tables
            source_to_table = {
                "additional_student_data": "student_info",
                "student": "student_info",
                "additional_program_data": "program_info",
                "clinical": "clinical_placements"
            }

            to_update = data.copy()
            to_update.pop('id', None)
            to_update.pop('student_id', None)
            to_update.pop('source', None)

            for key in to_update:
                if to_update[key] is None:
                    to_update.pop(key, None)

            conn = create_conn()
            cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

            if id is not None :
                set_values = ', '.join(f'{key} = \'{to_update[key]}\'' for key in to_update)

                query = f'UPDATE {source_to_table[source]} SET {set_values} WHERE id = {id}'

                cur.execute(query)
                conn.commit()

                return jsonify({"message": f"The student_id {student_id} was update successfully."})
            
            if id is None:
                columns = ', '.join([f'{key}' for key in to_update])
                values = ', '.join([f'\'{to_update[key]}\'' for key in to_update])

                query = f'INSERT INTO {source_to_table[source]}({columns}) VALUES (values);'

                cur.execute(query)
                conn.commit()

                return jsonify({"message": f"The record was created successfully."})

            cur.close()
            conn.close()

    # ========== STUDENT RECORD ENDPOINT ==========
    @app.route("/student_record_info", methods=["GET", "POST", "PATCH"])
    @login_required(role_required=["administrator", "editor", "viewer"])
    def student_record():
        conn = create_conn()
        cur = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

        if request.method == 'POST':
            data = request.get_json() or {}
        
            if (data != {}):
                student_id = data.get("student_id")

                cur.execute("SELECT * from student_info where id=%s;", (student_id,))
                result = cur.fetchone()

                if result is not None:
                    result_student = result

                    page_result = {}
                    page_result['student_info'] = [result_student]

                    cur.execute("SELECT * from program_info where student_id=%s;", (student_id,))
                    result_program = cur.fetchall()

                    page_result['program_info'] = result_program

                    cur.execute("SELECT * from clinical_placements where student_id=%s;", (student_id,))
                    result_clinical = cur.fetchall()

                    page_result['clinical_placements'] = result_clinical

                    return jsonify(page_result)
                else:
                    return jsonify({"message": "The student_id doesn't exist"})

        if request.method == 'GET':
            cur.execute("SELECT * from student_info;")
            result = cur.fetchall()
        
            return jsonify(result)

        cur.close()
        conn.close()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000, host="0.0.0.0")