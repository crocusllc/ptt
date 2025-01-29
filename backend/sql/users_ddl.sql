CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_email VARCHAR(100) UNIQUE NOT NULL,
    password_expiration_date DATE NOT NULL,
    user_role VARCHAR(20) CHECK (user_role IN ('administrator', 'editor', 'viewer')) NOT NULL
);

--ALTER TABLE students ENABLE ROW LEVEL SECURITY;
--ALTER TABLE clinical_placements ENABLE ROW LEVEL SECURITY;

-- Policy for students table
--CREATE POLICY student_admin_policy
--  ON students
--  FOR SELECT
--  USING (current_user = 'administrator');

-- Policy for clinical_placements table
--CREATE POLICY placement_admin_policy
--  ON clinical_placements
--  FOR SELECT
--  USING (current_user = 'administrator');

--ALTER TABLE students FORCE ROW LEVEL SECURITY;
--ALTER TABLE clinical_placements FORCE ROW LEVEL SECURITY;

