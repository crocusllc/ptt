import csv
import psycopg2
import yaml
import argparse
from cryptography.fernet import Fernet

# Set up command line argument parsing
parser = argparse.ArgumentParser(description="Configure and populate database based on provided YAML config.")
parser.add_argument("config_path", help="Path to the configuration file (config.yaml)")
args = parser.parse_args()

# Load YAML configuration
with open(args.config_path, 'r') as file:
    config = yaml.safe_load(file)

# Generate a key for encryption and initialize Fernet
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# Retrieve database configuration from YAML
db_config = config['database']

# Connect to PostgreSQL database
conn = psycopg2.connect(
    dbname=database['name'],
    user=database['user'],
    password=database['password'],
    host=database['host'],
    port=database['port']
)
cur = conn.cursor()

# Function to execute SQL files
def execute_sql_file(file_path):
    with open(file_path, 'r') as file:
        sql = file.read()
        cur.execute(sql)

# Execute DDL files for setting up users and logs
execute_sql_file('backend/src/sql/users_ddl.sql')
execute_sql_file('backend/src/sql/logs_ddl.sql')

# Organize fields by category for CSV generation
student_fields = [field for field in config['fields'] if ('Student' in field['Category'] or 'IHE' in field['Category']) and field['Include-in-bulk-upload']]
clinical_placement_fields = [field for field in config['fields'] if 'Culminating Clinical Placement' in field['Category'] and field['Include-in-bulk-upload']]
additional_fields = [field for field in config['fields'] if 'Additional Student Information' in field['Category'] and field['Include-in-bulk-upload']]

# Function to create CSV files
def create_csv(filename, fields):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        headers = [field['CSV-column-name'] for field in fields]
        writer.writerow(headers)

# Create empty CSV files with only headers
create_csv('student_data.csv', student_fields)
create_csv('clinical_placement_data.csv', clinical_placement_fields)
create_csv('additional_program_student_data.csv', additional_fields)

# Print a confirmation message
print("CSV files for bulk upload have been created.")

# Commit changes and close database connection
conn.commit()
cur.close()
conn.close()
