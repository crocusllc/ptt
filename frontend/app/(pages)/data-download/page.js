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


const DownloadDataForm = () => {
  const [filters, setFilters] = useState({
    graduationTerm: "",
    exitDate: "",
    enrollmentStatus: "",
    academicLevel: "",
    programName: "",
    completionStatus: "",
    placementType: "",
    placementDistrict: "",
    placementSchool: "",
    startDate: null,
    endDate: null,
  });

  // Handle changes in dropdowns and text fields
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Handle download actions
  const handleDownloadAll = () => {
    alert("Downloading all records...");
  };

  const handleDownloadSelected = () => {
    alert("Downloading selected records with filters: " + JSON.stringify(filters));
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
        <Stack spacing={2}>
          {[
            { label: "IHE Expected Graduation Term", field: "graduationTerm" },
            { label: "IHE Exit Date", field: "exitDate" },
            { label: "IHE Enrollment Status", field: "enrollmentStatus" },
            { label: "Academic Level", field: "academicLevel" },
            { label: "Program Name", field: "programName" },
            { label: "Program Completion Status", field: "completionStatus" },
            { label: "Placement Type", field: "placementType" },
            { label: "Placement District", field: "placementDistrict" },
            { label: "Placement School", field: "placementSchool" },
          ].map((dropdown) => (
            <Box key={dropdown.field}>
              <Typography variant="body2" sx={{ marginBottom: "4px" }}>
                {dropdown.label}:
              </Typography>
              <Select
                fullWidth
                value={filters[dropdown.field]}
                onChange={(e) => handleChange(dropdown.field, e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Option1">Option 1</MenuItem>
                <MenuItem value="Option2">Option 2</MenuItem>
              </Select>
            </Box>
          ))}

          <Box>
            <Typography variant="body2" sx={{ marginBottom: "4px" }}>
              Placement Occurred Between:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    value={filters.startDate}
                    onChange={(date) => handleChange("startDate", date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    value={filters.endDate}
                    onChange={(date) => handleChange("endDate", date)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleDownloadSelected}
          sx={{ marginTop: "16px" }}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
};

export default DownloadDataForm;
