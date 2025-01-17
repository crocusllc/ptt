"use client";

import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function StudentInfoForm({onCancel}) {
  const [formData, setFormData] = useState({
    otherLanguages: "",
    explain: "",
    completionStatus: "",
    completionNotes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form Submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      otherLanguages: "",
      explain: "",
      completionStatus: "",
      completionNotes: "",
    });
    onCancel && onCancel(); // Executes the callback if it exists;
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="licensure-met-label">Languages Spoken Other than English</InputLabel>
        <Select
          labelId="licensure-met-label"
          name="licensureMet"
          value={formData.otherLanguages}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="Spanish">Spanish</MenuItem>
          <MenuItem value="Dutch">Dutch</MenuItem>
          <MenuItem value="Japanese">Japanese</MenuItem>
          <MenuItem value="French">French</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="explain"
        label="If you select Other, please specify"
        value={formData.explain}
        onChange={handleChange}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel id="completion-status-label">First Generation Status</InputLabel>
        <Select
          labelId="completion-status-label"
          name="completionStatus"
          value={formData.completionStatus}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">NO</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="completionNotes"
        label="License Number"
        value={formData.completionNotes}
        onChange={handleChange}
        fullWidth
      />

      <Typography variant="caption" sx={{ color: "gray" }}>
        * indicates required fields
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
