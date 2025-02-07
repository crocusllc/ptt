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

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const readCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split("\n");
        const csvHeaders = rows[0].split(",");

        //console.log("CSV Headers:", csvHeaders);

        const jsonData = {
          file_name: file.name,
          table_name: FormConfig?.tableName,
          fields: csvHeaders,
        };

        resolve(jsonData); // Resolve the Promise with jsonData
      };

      reader.onerror = (e) => reject(e.target.error);
      reader.readAsText(file);
    });
  };

  // Handle file upload
  const handleUpload = async () => {
    const file = selectedFile;
    const formData = new FormData();
    // Append file
    formData.append("file", file);
    const jsonData = await readCSVFile(file);
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

      //console.log("Upload successful:", result);

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
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "460px",
              minHeight: "200px"
            },
          },
        }}
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
