import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";

const FileUpload = ({title}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = () => {
    if (selectedFile) {
      alert(`File uploaded: ${selectedFile.name}`);
      // You can add your upload logic here
    } else {
      alert("Please select a file first.");
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
