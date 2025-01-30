"use client"

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import getConfigData from "@/app/utils/getConfigs"

const getFullRecordLink = (params) => {
  return <a href={`/student-records/${params.row.id}`}>View Full Record</a>;
};

const columns = [
  {
    field: 'id',
    headerName: 'Student ID',
    width: 90,
  },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 200,
  },
  {
    field: 'academicLevel',
    headerName: 'Academic Level',
    width: 200,
  },
  {
    field: 'programName',
    headerName: 'Program Name',
    width: 200,
  },
  {
    field: 'placementType',
    headerName: 'Placement Type',
    width: 200,
  },
  {
    field: 'editUrl',
    headerName: 'View/Edit',
    width: 200,
    renderCell: getFullRecordLink,
  }
];

const rows = [
  {
    id: 10000001,
    firstName: "John",
    lastName: "Doe",
    academicLevel: "Undergraduate",
    programName: "Computer Science",
    placementType: "Internship",
  },
  {
    id: 10000002,
    firstName: "Jane",
    lastName: "Smith",
    academicLevel: "Graduate",
    programName: "Data Science",
    placementType: "Co-op",
  },
  {
    id: 10000003,
    firstName: "Michael",
    lastName: "Brown",
    academicLevel: "Undergraduate",
    programName: "Electrical Engineering",
    placementType: "Internship",
  },
  {
    id: 10000004,
    firstName: "Emily",
    lastName: "Johnson",
    academicLevel: "Undergraduate",
    programName: "Mechanical Engineering",
    placementType: "Internship",
  },
  {
    id: 10000005,
    firstName: "Chris",
    lastName: "Davis",
    academicLevel: "Graduate",
    programName: "Business Administration",
    placementType: "Co-op",
  },
  {
    id: 10000006,
    firstName: "Sarah",
    lastName: "Wilson",
    academicLevel: "Undergraduate",
    programName: "Psychology",
    placementType: "Research Assistant",
  },
  {
    id: 10000007,
    firstName: "David",
    lastName: "Martinez",
    academicLevel: "Graduate",
    programName: "Civil Engineering",
    placementType: "Internship",
  },
  {
    id: 10000008,
    firstName: "Sophia",
    lastName: "Garcia",
    academicLevel: "Undergraduate",
    programName: "Biology",
    placementType: "Internship",
  },
  {
    id: 10000009,
    firstName: "Ethan",
    lastName: "Taylor",
    academicLevel: "Undergraduate",
    programName: "Finance",
    placementType: "Internship",
    editUrl: "/student-record/10000001/view"
  },
  {
    id: 10000010,
    firstName: "Olivia",
    lastName: "Anderson",
    academicLevel: "Graduate",
    programName: "Marketing",
    placementType: "Co-op",
  },
  {
    id: 10000011,
    firstName: "James",
    lastName: "Hernandez",
    academicLevel: "Undergraduate",
    programName: "Chemistry",
    placementType: "Research Assistant",
  },
  {
    id: 10000012,
    firstName: "Isabella",
    lastName: "Moore",
    academicLevel: "Undergraduate",
    programName: "Political Science",
    placementType: "Internship",
  },
  {
    id: 10000013,
    firstName: "Alexander",
    lastName: "Clark",
    academicLevel: "Graduate",
    programName: "Architecture",
    placementType: "Internship",
  },
  {
    id: 10000014,
    firstName: "Mia",
    lastName: "Lopez",
    academicLevel: "Undergraduate",
    programName: "Economics",
    placementType: "Co-op",
  },
  {
    id: 10000015,
    firstName: "Daniel",
    lastName: "Lee",
    academicLevel: "Graduate",
    programName: "Environmental Science",
    placementType: "Research Assistant",
  },
];

export default function StudentRecords() {
  const studentRecordFormFields = getConfigData()?.fields
    ?.find( el => el?.form?.Name === "Student Records")?.form;

  const studentRecordKeys = Object.keys(studentRecordFormFields);

  let gridFields = [];

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
      <Box sx={{ height: (numberRows * 58), width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
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
    </>
  );
}
