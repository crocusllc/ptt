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

export default function ProgramInformationForm({onCancel}) {
  const [formData, setFormData] = useState({
    licensureMet: "",
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
      licensureMet: "",
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
        <InputLabel id="licensure-met-label">Licensure Program Requirements Met on Entry</InputLabel>
        <Select
          labelId="licensure-met-label"
          name="licensureMet"
          value={formData.licensureMet}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="explain"
        label="If no, please explain"
        value={formData.explain}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
      />

      <FormControl fullWidth>
        <InputLabel id="completion-status-label">Program Completion Status*</InputLabel>
        <Select
          labelId="completion-status-label"
          name="completionStatus"
          value={formData.completionStatus}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="not-started">Not Started</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="completionNotes"
        label="Program Completion Notes"
        value={formData.completionNotes}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
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
