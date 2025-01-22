"use client"

import Box from '@mui/material/Box';
import { useParams } from "next/navigation";
import { student_record_info } from "@/app/utils/dummyData"
import {useEffect, useState} from "react";
import CategoryManager from "@/app/(pages)/student-records/[slug]/CategoryManager";
import Stack from '@mui/material/Stack';
import getConfigData from "@/app/utils/getConfigs"
import {IconButton} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function StudentRecord() {
  const params = useParams();
  const slug = params.slug;

  const [studentRecordData, setStudentRecordData] = useState();

  useEffect(()=> {
    // Fetch fn here
    setStudentRecordData(student_record_info);
  }, [])

  // Get the Student Record Config Data.
  const formData = getConfigData()?.fields.find( el => el?.form?.name === "Student Records").form;
  const fieldKeys =  Object.keys(formData)
  let formCategories = {}
  // Grouping fields by category
  fieldKeys.forEach( el => {
    if(formData[el]?.Category) {
      if(formCategories[formData[el].Category]) {
        formCategories[formData[el].Category].push(formData[el])
      } else {
        formCategories = {
          ...formCategories,
          [formData[el].Category]: [
            formData[el]
          ]
        }
      }
    }
  })

  const categories = getConfigData()?.categories;

  return (
    <>
      <h1>Student ID #: {slug}</h1>
      <Stack spacing={2} sx={{maxWidth: "768px"}}>
        {
          studentRecordData &&
          Object.keys(studentRecordData).map( catName => {
            return (
              <Stack spacing={2} key={catName} sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px",  position: "relative"}}>
                <Box component={"h2"} sx={{marginBottom: "10px"}}>
                  {catName}
                </Box>
                {
                  categories[catName]?.add && (
                    <Stack direction="row" sx={{position: "absolute", right:"6px", top:"6px", marginTop: "0 !important"}}>
                      <IconButton aria-label="add">
                        <AddCircleIcon />
                      </IconButton>
                    </Stack>
                  )
                }
                {
                  studentRecordData[catName].map( (item, i) => {
                    const isMultiple = studentRecordData[catName].length > 1;
                    return (
                      <Stack key={i} sx={{ border: `${ isMultiple ? "1px solid #ccc" : "none" }`, borderRadius: "4px", position: `${ isMultiple ? "relative" : "initial" }` }}>
                        <CategoryManager displayData={item} formFields={formCategories[catName]} config={categories[catName]}/>
                      </Stack>
                    )
                  })
                }
              </Stack>
            )
          })
        }
      </Stack>
    </>
  );
}
