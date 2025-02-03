'use client'

import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import {useSession} from "next-auth/react";


const FileUpload = ({title}) => {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    const file = selectedFile;
    const formData = new FormData();

    // Append file
    formData.append("file", file);

    // Append JSON data as a Blob
    const jsonData = {
      file_name: "IHE_data_file.csv",
      table_name: "student_info",
      fields: [
        "id", "first_name", "Middleinitial", "last_name", "partial_ssn", "birth_date",
        "ihe_email", "alternate_email", "entry_term", "ihe_expected_graduation_term",
        "ihe_exit_date", "ihe_enrollment_status", "program_enrollment_term", "academic_level",
        "academic_award_received", "program_name", "program_enrollment_status", "endorsement_1",
        "endorsement_2", "content_concentration_area", "program_entry_gpa", "program_completion_gpa",
        "undergraduate_major", "american_indian_or_alaska_native", "asian", "black_or_african_american",
        "hispanic_or_latino", "middle_eastern_or_north_african", "native_hawaiian_or_pacific_islander",
        "white", "gender"
      ]
    };

    formData.append("data", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file_upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.user.accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ marginBottom: "8px" }}>
        {title}
      </Typography>
      <TextField
        type="file"
        slotProps={{
          input: {
            inputProps: {
              accept: ".csv"
            },
          },
        }}
        variant="outlined"
        size="small"
        fullWidth
        onChange={handleFileChange}
        sx={{ marginBottom: "16px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Upload
      </Button>
    </Box>
  );
};

export default FileUpload;
