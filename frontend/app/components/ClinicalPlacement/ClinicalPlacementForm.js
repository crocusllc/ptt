"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
} from "@mui/material";

export default function ClinicalPlacementForm({onCancel}) {
  const [formData, setFormData] = useState({
    placementType: "",
    startDate: "",
    endDate: "",
    alignment: "",
    gradeLevel: "",
    licensureLevel: "",
    contentArea: "",
    district: "",
    school: "",
    principalName: "",
    principalEmail: "",
    mentorTeacherName: "",
    mentorTeacherEmail: "",
    additionalMentorName: "",
    additionalMentorEmail: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      placementType: "",
      startDate: "",
      endDate: "",
      alignment: "",
      gradeLevel: "",
      licensureLevel: "",
      contentArea: "",
      district: "",
      school: "",
      principalName: "",
      principalEmail: "",
      mentorTeacherName: "",
      mentorTeacherEmail: "",
      additionalMentorName: "",
      additionalMentorEmail: "",
      notes: "",
    });
    onCancel && onCancel(); // Executes the callback if it exists;
  };

  return (
    <Box component="form" sx={{ p: 4 }} onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Placement Form
      </Typography>

      {/** Placement Type */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Placement Type*</InputLabel>
        <Select
          value={formData.placementType}
          name="placementType"
          onChange={handleChange}
        >
          <MenuItem value="Type1">Type 1</MenuItem>
          <MenuItem value="Type2">Type 2</MenuItem>
          <MenuItem value="Type3">Type 3</MenuItem>
        </Select>
      </FormControl>

      {/** Start and End Dates */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Placement Start Date*"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Placement End Date*"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>

      {/** Alignment */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Placement Alignment*</InputLabel>
        <Select
          value={formData.alignment}
          name="alignment"
          onChange={handleChange}
        >
          <MenuItem value="Aligned">Aligned</MenuItem>
          <MenuItem value="Not Aligned">Not Aligned</MenuItem>
        </Select>
      </FormControl>

      {/** Other Dropdowns */}
      {["gradeLevel", "licensureLevel", "contentArea", "district", "school"].map(
        (field, idx) => (
          <FormControl fullWidth sx={{ mb: 2 }} key={idx}>
            <InputLabel>
              {field.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase())}*
            </InputLabel>
            <Select value={formData[field]} name={field} onChange={handleChange}>
              <MenuItem value="Option1">Option 1</MenuItem>
              <MenuItem value="Option2">Option 2</MenuItem>
            </Select>
          </FormControl>
        )
      )}

      {/** Principal and Mentor Fields */}
      {["principalName", "principalEmail", "mentorTeacherName", "mentorTeacherEmail"].map(
        (field, idx) => (
          <TextField
            label={field
              .replace(/([A-Z])/g, " $1")
              .replace(/^\w/, (c) => c.toUpperCase())}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            key={idx}
          />
        )
      )}

      {/** Additional Mentor Fields */}
      {["additionalMentorName", "additionalMentorEmail"].map((field, idx) => (
        <TextField
          label={field
            .replace(/([A-Z])/g, " $1")
            .replace(/^\w/, (c) => c.toUpperCase())}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          key={idx}
        />
      ))}

      {/** Notes */}
      <TextField
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      {/** Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          Save
        </Button>
      </Box>
    </Box>
  );
};
