"use client"

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import getConfigData from "@/app/utils/getConfigs"
import {useEffect, useState} from "react";
import {useAuth} from "@/app/utils/contexts/AuthProvider";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {Button} from "@mui/material";

const getFullRecordLink = (params) => {
  return <a href={`/student-records/${params.row.student_id}`} title="View student full record">View Full Record</a>;
};
export default function StudentRecordsPage() {
  // Getting user session data.
  const [studentRecords, setStudentRecords] = useState();
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelection = (rowSelectionModel) => {
    setSelectedRows(rowSelectionModel); // rowSelectionModel contains IDs of selected rows
  };

  let gridFields = [];
  let orderedGridColumn = []
  const { userSession } = useAuth();

  useEffect( ()=> {
    if (userSession && !studentRecords){
      async function fetchStudentRecordInfo() {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student_record_info`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userSession.user.accessToken}`
            }
          });

          if (!response.ok) {
            console.error("HTTP Error:", response.status);
          }

          return await response.json();
        } catch (error) {
          console.error("Error fetching student record info:", error);
        }
      }
      fetchStudentRecordInfo().then(data=> {
        setStudentRecords(data)
      });
    }
  },[userSession])

  // Get Student record fields from config file.
  const studentRecordFormFields = getConfigData()?.fields
    ?.find( el => el?.form?.Name === "Student Records")?.form;
  const studentRecordKeys = Object.keys(studentRecordFormFields);
  // Using the key to filter field displayed in the student record page.
  studentRecordKeys.forEach( el => {
    if(studentRecordFormFields[el]['Use as filter in View/Edit search page?'] === true){
      gridFields.push(studentRecordFormFields[el])
    }
  });

  // Categories defined in config.yaml file.
  const categories = getConfigData()?.categories;
  // Grouped and sorted by categories
  Object.keys(categories)?.forEach( cat => {
    const sortedData = gridFields.filter(item => item.Category === cat)
      .sort((a, b) => a["Order within category"] - b["Order within category"]);
    orderedGridColumn = [
      ...orderedGridColumn,
      ...sortedData,
    ]
  })

  const gridColumns = [
    ...orderedGridColumn.map( field => ({
      field: field['CSV column name'],
      headerName: field['Data element label'],
      width: 150,
    })),
    {
      field: 'editUrl',
      headerName: '',
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: getFullRecordLink,
    }
  ];

  const deleteStudentRecord = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete_student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userSession.user.accessToken}`
        },
        body: JSON.stringify({student_id: selectedRows}),
      });

      if (!response.ok) {
        console.error("HTTP Error:", response.status);
      } else {
        const filteredStudents = studentRecords?.filter(student => !selectedRows.includes(student.student_id));
        setStudentRecords(filteredStudents);
      }

      return await response.json();

    } catch (error) {
      console.error("Error fetching student record info:", error.message);
    }
  }

  const numberRows = 15;

  return (
    <>
      <h1>Student Records</h1>
      {
        studentRecords && (
          <>
            <Box sx={{textAlign: "right"}}>
              <IconButton
                aria-label="delete records"
                title={"Delete records"}
                size="large"
                color="primary"
                disabled={!selectedRows.length > 0}
                onClick={deleteStudentRecord}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: (numberRows * 58), width: '100%' }}>
              <DataGrid
                columns={gridColumns}
                rows={studentRecords}
                getRowId={(row) => row.student_id}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: numberRows,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleRowSelection}
              />
            </Box>
            <Button onClick={()=> console.log(selectedRows)}>Log Rows</Button>
            <Button onClick={()=> console.log(studentRecords)}>Data</Button>
          </>
        )
      }
    </>
  );
}

