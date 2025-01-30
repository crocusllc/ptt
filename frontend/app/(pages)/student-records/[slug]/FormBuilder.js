import React, {useState} from "react";
import dayjs from 'dayjs';
import Box from "@mui/material/Box";
import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function FormBuilder({formFields, onCancel, defaultData}) {
  const [formData, setFormData] = useState(
    Object.fromEntries(formFields.map(field => [field["CSV column name"], defaultData?.[field["Data element label"]] ?? '']))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={1} component="form" sx={{ p: 4 }} onSubmit={handleSubmit}>
      {
        formFields.map( (field, i)=> {
          console.log(field["Required field"])
          console.log(field)
          if (field?.Type === "select") {
            return (
              <FormControl variant="filled" fullWidth key={i} required={field["Required field"]}>
                <InputLabel id={`${[field['CSV column name']]}-label`}>
                  {field['Data element label']}
                </InputLabel>
                <Select
                  labelId={`${[field['CSV column name']]}-label`}
                  id={field['CSV column name']}
                  value={formData[field['CSV column name']]}
                  label={field['Data element label']}
                  onChange={(e) => handleChange(field['CSV column name'], e.target.value)}
                  multiple={field["multi-select"]}
                >
                  {
                    field['Dropdown or validation values']?.split(",").map( (opt, i) => <MenuItem key={i} value={opt}>{opt}</MenuItem>)
                  }
                </Select>
              </FormControl>
            )
          } else if( field?.Type === "text") {
            return (
              <TextField key={i} id={field['CSV column name']} required={field["Required field"]} defaultValue={formData[field['CSV column name']]} label={field['Data element label']} variant="filled" />
            )
          } else if( field?.Type === "date") {
            return (
              <LocalizationProvider dateAdapter={AdapterDayjs} key={i}>
                <DatePicker
                  label={field['Data element label']}
                  value={formData[field['CSV column name']] === '' ? null : dayjs(formData[field['CSV column name']])}
                  onChange={(date) => handleChange(field['CSV column name'], date)}
                />
              </LocalizationProvider>
            )
          } else {
            return <div key={i}>The field type not match: {field?.Type}</div>
          }
        })
      }
      {/** Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={()=>onCancel()}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          Save
        </Button>
      </Box>
    </Stack>
  )
}