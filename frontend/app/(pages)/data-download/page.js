"use client"

import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select, Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import getConfigData from "@/app/utils/getConfigs";
import FormBuilder from "@/app/(pages)/student-records/[slug]/FormBuilder";


const DownloadDataForm = () => {
  const studentRecordFormFields = getConfigData()?.fields
    ?.find( el => el?.form?.Name === "Student Records")?.form;

  const studentRecordKeys = Object.keys(studentRecordFormFields);

  let downLoadFormFields = [];

  studentRecordKeys.forEach( el => {
    if(studentRecordFormFields[el]['Use as filter on Download page?']){
      downLoadFormFields.push(studentRecordFormFields[el])
    }
  });

  // Handle download actions
  const handleDownloadAll = () => {
    alert("Downloading all records...");
  };

  const handleDownloadSelected = (data) => {
    alert("Downloading selected records with filters: " + JSON.stringify(data));
  };

  return (
    <Box sx={{ maxWidth: "600px"}}>
      <Box sx={{ marginBottom: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <Typography variant="h6">Download All Records:</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadAll}
          sx={{ marginTop: "8px" }}
        >
          Download
        </Button>
      </Box>

      <Box sx={{ marginBottom: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <Typography variant="h6" gutterBottom>
          Download Selected Records:
        </Typography>

        <FormBuilder formFields={downLoadFormFields} submitBtnTxt={"Download"} onSubmit={handleDownloadSelected}/>
      </Box>
    </Box>
  );
};

export default DownloadDataForm;
