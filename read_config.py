import csv
import yaml
import argparse
import jinja2
import psycopg2
from psycopg2 import sql
import os
import subprocess
from cryptography.fernet import Fernet

def parse_config(config_path):
    """Load and parse the given YAML config file, returning a dict of required info."""
    with open(config_path, "r") as f:
        docs = list(yaml.safe_load_all(f))
    for i, doc in enumerate(docs, start=1): 
        if doc.get('fields'):
            for form in doc.get('fields'):
                aform = doc.get("fields",[])
                form_def = form.get("form", [])
                api_name = form_def.get("API_Name")
                # Build field_list by iterating over all 'field-*' entries
                field_list = []
                for key, value in form_def.items():
                    if key.startswith("field-"):
                        field_info = {
                            "csv_name": value.get("CSV column name"),
                            "type": value.get("Type", "text"),  # default to 'text' if missing
                            "required_field": value.get("Required field", False),
                            "dropdown_values": value.get("Dropdown or validation values", ""),
                            "include_in_download": value.get("Include in download file", False),
                    }
        else:
            pass
       
    return {"api_name": api_name, "field_list": field_list}

def parse_config_for_csv(config_path):
    """Load and parse the given YAML config file, returning a dict of required info."""
    field_list = []
    with open(config_path, "r") as f:
        docs = list(yaml.safe_load_all(f))
    for i, doc in enumerate(docs, start=1): 
        if doc.get('fields'):
            form = doc.get("fields",[])
            #print(form[0])
            form_def = form[0].get("form", {})
            for key, value in form_def.items():
                if key.startswith("field-"):
                    #print(value.get("CSV column name"), value.get("Category"))
                    field_list.append((value.get("CSV column name"), value.get("Category")))
        else:
            pass
    return field_list
            

# Function to create CSV files
def create_csv(fields):
    student_headers = []
    clinical_headers = []
    additional_headers = []
    for field in fields:
        if field[1] == 'Global':
            student_headers.append(field[0])
            clinical_headers.append(field[0])
            additional_headers.append(field[0])
        elif field[1] == 'Student IHE Enrollment Information':
            student_headers.append(field[0])
        elif field[1] == 'Culminating Clinical Placement':
            clinical_headers.append(field[0])
        elif field[1] == 'Additional Program Information' or 'Additional Student Information':
            additional_headers.append(field[0])
    filenames = ['student_data.csv', 'clinical_placement_data.csv', 'additional_program_student_data.csv']
    headers = [student_headers, clinical_headers, additional_headers]
    for filename, headers in zip(filenames, headers):
       with open(filename, 'w', newline='') as csvfile:
          writer = csv.writer(csvfile)
          writer.writerow(headers)
    print("CSV files for bulk upload have been created.")

# Function to parse config file for database
def parse_config_for_db(config_path):
    """Load and parse the given YAML config file, returning a dict of required info."""
    field_list = []
    
    with open(config_path, "r") as f:
        docs = list(yaml.safe_load_all(f))

    for doc in docs:
        if 'fields' in doc and 'form' in doc['fields']:
            form_def = doc['fields']['form']
            for key, value in form_def.items():
                if key.startswith("field-"):
                    field_list.append((value.get("CSV column name"), value.get("Category"), value.get("Type")))

    return field_list


def create_sql_files(fields):
    """Creates SQL table definitions based on the parsed YAML config file."""
    tables = {
        "student_info": [],
        "program_info": [],
        "clinical_placements": []
    }

    # Map categories to tables
    category_to_table = {
        "Additional Student Information": "student_info",
        "Student IHE Enrollment Information": "student_info",
        "Additional Program Information": "program_info",
        "Culminating Clinical Placement": "clinical_placements"
    }

    # Define basic type mapping from YAML types to SQL types
    type_mapping = {
        "text": "TEXT",
        "select": "TEXT",  # Assuming options are stored as text
        "date": "DATE",
        "integer": "INTEGER",
        "boolean": "BOOLEAN"
    }

    # Group fields into tables
    for column_name, category, field_type in fields:
        table_name = category_to_table.get(category)
        sql_type = type_mapping.get(field_type, "TEXT")  # Default to TEXT if unknown
        if table_name:
            tables[table_name].append(f"{column_name} {sql_type}")

    # Generate SQL scripts
    sql_statements = {}
    for table_name, columns in tables.items():
        sql_statements[table_name] = f"""CREATE TABLE {table_name} (id SERIAL PRIMARY KEY,{",".join(columns)});"""

    # Save SQL scripts to files
    for table_name, sql in sql_statements.items():
        file_name = f"{table_name}.sql"
        with open(file_name, "w") as f:
            f.write(sql)
        print(f"Generated {file_name}")

    return sql_statements

       

def main():
    parser = argparse.ArgumentParser(
        description="Generate a Flask app, csv files and sql files from a Jinja template and a YAML config."
    )
    parser.add_argument(
        "--template",
        required=True,
        help="Path to the Jinja2 template file (e.g. app_template.jinja2)."
    )
    parser.add_argument(
        "--config",
        required=True,
        help="Path to the YAML config file (e.g. config.yaml)."
    )
    parser.add_argument(
        "--mode",
        choices=["app", "csv", "db"],
        help="Choose the mode of operation: app, csv, or db"
    )
    parser.add_argument(
        "--output",
        help="Output name for app"
    )
    args = parser.parse_args()
 

    if args.mode == 'csv': 
        fields = parse_config_for_csv(args.config)
        create_csv(fields)
    elif args.mode == 'db':
        # Create the student table
        fields = parse_config_for_db(args.config)
        create_sql_files(fields)
    elif args.mode == 'app':    
        # 1. Parse the config
        config_data = parse_config(args.config)

        # 2. Load the Jinja template
        with open(args.template, "r", encoding="utf-8") as f:
            template_str = f.read()

        # 3. Render the template
        jinja_env = jinja2.Environment()
        template = jinja_env.from_string(template_str)
        rendered_code = template.render(parsed_config=config_data)

        # 4. Write to the output file
        with open(args.output, "w", encoding="utf-8") as out_file:
           out_file.write(rendered_code)

        print(f"Generated {args.output} from {args.config} using template {args.template}!")

if __name__ == "__main__":
    main()

