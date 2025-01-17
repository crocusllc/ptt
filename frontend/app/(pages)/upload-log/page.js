"use client"

import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import {useState} from "react";
import { DataGrid } from "@mui/x-data-grid";

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`upload-data-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
export default function UploadPage() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs= ["IHE Data", "Clinical Placement Data", "Program Student Data"];

  const columns = [
    { field: "file", headerName: "File", width: 150 },
    { field: "uploadDate", headerName: "Upload Date", width: 150 },
    { field: "recordStatus", headerName: "Record Status", width: 150 },
    { field: "errorMessage", headerName: "Error Message", width: 200 },
    { field: "studentId", headerName: "Student ID", width: 150 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "birthDate", headerName: "Birthdate", width: 150 },
  ];

  const rows = [
    { id: 1, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Created", errorMessage: "", studentId: "22141423", firstName: "Solveig", lastName: "Hansen", birthDate: "3/3/2003" },
    { id: 2, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Updated", errorMessage: "", studentId: "22565634", firstName: "Talia", lastName: "Haines", birthDate: "4/4/2002" },
    { id: 3, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Created", errorMessage: "", studentId: "22777888", firstName: "Shoshana", lastName: "Painter", birthDate: "5/5/2005" },
    { id: 4, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Rejected", errorMessage: "Invalid Birth Date", studentId: "22372121", firstName: "Roisin", lastName: "Culhane", birthDate: "6/6/2003" },
    { id: 5, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Updated", errorMessage: "", studentId: "22987601", firstName: "Miles", lastName: "Hank", birthDate: "7/7/2001" },
    { id: 6, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Created", errorMessage: "", studentId: "22845784", firstName: "Dennis", lastName: "Berkery", birthDate: "8/8/2003" },
    { id: 7, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Updated", errorMessage: "", studentId: "22989402", firstName: "Elliot", lastName: "Hank", birthDate: "7/7/2001" },
    { id: 8, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Created", errorMessage: "", studentId: "22345648", firstName: "Jessa", lastName: "Way", birthDate: "10/2/2003" },
    { id: 9, file: "fall2024.csv", uploadDate: "09/14/2024", recordStatus: "Created", errorMessage: "", studentId: "22190077", firstName: "Devon", lastName: "Dyreson", birthDate: "12/27/2002" },
  ];

  return (
    <Box>
      <h1>Upload Log</h1>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {
            tabs.map( (tab, i) => <Tab label={tab} key={i}/>)
          }
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </div>
      </TabPanel>
    </Box>
  )
}

