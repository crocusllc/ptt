import csv
import yaml
import argparse
import jinja2
import psycopg2
from psycopg2 import sql
import os
import subprocess
from cryptography.fernet import Fernet

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
    print(student_headers)
    print(clinical_headers)
    print(additional_headers)
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
    for i, doc in enumerate(docs, start=1): 
        if doc.get('fields'):
            form = doc.get("fields",[])
            #print(form[0])
            form_def = form[0].get("form", {})
            for key, value in form_def.items():
                if key.startswith("field-"):
                    #print(value.get("CSV column name"), value.get("Category"))
                    field_list.append((value.get("CSV column name"), value.get("Category"), value.get("Type")))
        else:
            pass
    return field_list

def create_sql_files(fields):
    """We need to create two tables, student info and clinical placements with
    fields read from the config.yaml file"""
    pass   
       

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

    args = parser.parse_args()
 

    if args.mode == 'csv': 
        fields = parse_config_for_csv(args.config)
        create_csv(fields)
    elif args.mode == 'db':
        # Create the student table
        
        # create the clinical info table
        
        # create the program info table
        
        # 
        
    # 1. Parse the config
    #config_data = parse_config(args.config)

    # 2. Load the Jinja template
    #with open(args.template, "r", encoding="utf-8") as f:
    #    template_str = f.read()

    # 3. Render the template
    #jinja_env = jinja2.Environment()
    #template = jinja_env.from_string(template_str)
    #rendered_code = template.render(parsed_config=config_data)

    # 4. Write to the output file
    #with open(args.output, "w", encoding="utf-8") as out_file:
    #    out_file.write(rendered_code)

    #print(f"Generated {args.output} from {args.config} using template {args.template}!")

if __name__ == "__main__":
    main()

