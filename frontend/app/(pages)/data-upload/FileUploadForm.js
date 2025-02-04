'use client'

import React, { useState } from "react";
import {Box, Button, Typography, TextField, IconButton} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {useAuth} from "@/app/utils/contexts/AuthProvider";


const FileUpload = ({FormConfig}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [uploadResponse, setUploadResponse] = useState()
  const { userSession } = useAuth();
  console.log(userSession)


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
      table_name: FormConfig?.tableName,
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
          "Authorization": `Bearer ${userSession.user.accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setUploadResponse(result);
      setOpen(true);

      console.log("Upload successful:", result);

    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ marginBottom: "8px" }}>
        {FormConfig.title}
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
      <Dialog
        open={open}
        onClose={()=> setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Upload response:
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={()=> setOpen(false)}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            {
              uploadResponse?.message
            }
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FileUpload;
