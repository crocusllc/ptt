"use client"

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import getConfigData from "@/app/utils/getConfigs"
import {SessionProvider, useSession} from "next-auth/react";
import {useEffect, useState} from "react";

const getFullRecordLink = (params) => {
  return <a href={`/student-records/${params.row.id}`}>View Full Record</a>;
};
function StudentRecords() {
  // Getting user session data.
  const { data: session } = useSession();
  const [studentRecords, setStudentRecords] = useState();
  let gridFields = [];

  useEffect( ()=> {
    if (session){
      async function fetchStudentRecordInfo() {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student_record_info`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.user.accessToken}`
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
  },[session])

  // Get Student record fields from config file.
  const studentRecordFormFields = getConfigData()?.fields
    ?.find( el => el?.form?.Name === "Student Records")?.form;
  const studentRecordKeys = Object.keys(studentRecordFormFields);
  // Using the key to filter field displayed in the student record page.
  studentRecordKeys.forEach( el => {
    if(studentRecordFormFields[el]['Display on Student Record page?'] === true){
      gridFields.push(studentRecordFormFields[el])
    }
  });


  const gridColumns = [
    {
      field: 'id',
      headerName: 'Student ID',
      width: 90,
    },
    ...gridFields.map( field => ({
      field: field['CSV column name'],
      headerName: field['Data element label'],
      width: 150,
    })),
    {
      field: 'editUrl',
      headerName: 'View/Edit',
      width: 200,
      renderCell: getFullRecordLink,
    }
  ];

  const numberRows = 15;

  return (
    <>
      <h1>Student Records</h1>
      {
        studentRecords && (
          <Box sx={{ height: (numberRows * 58), width: '100%' }}>
            <DataGrid
              rows={studentRecords}
              columns={gridColumns}
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
            />
          </Box>
        )
      }
    </>
  );
}

export default function StudentRecordsPage() {
  return (
    <SessionProvider>
      <StudentRecords />
    </SessionProvider>
  );
}
