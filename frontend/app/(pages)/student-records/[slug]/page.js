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
import FormBuilder from "@/app/(pages)/student-records/[slug]/FormBuilder";

export default function StudentRecord() {
  const params = useParams();
  const slug = params.slug;

  const [studentRecordData, setStudentRecordData] = useState();
  const [addFormEnabled, setAddFormEnabled] = useState(false);

  useEffect(()=> {
    // Fetch fn here
    setStudentRecordData(student_record_info);
  }, [])

  // Get the Student Record Config Data.
  const formData = getConfigData()?.fields.find( el => el?.form?.Name === "Student Records")?.form;
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

  const handleSubmit = (data) => {
    alert("Submitted data: " + JSON.stringify(data));
  };

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
                  (categories[catName]?.addable && !addFormEnabled) && (
                    <Stack direction="row" sx={{position: "absolute", right:"6px", top:"10px", marginTop: "0 !important"}}>
                      <IconButton aria-label="add" onClick={()=>setAddFormEnabled(true)}>
                        <AddCircleIcon />
                      </IconButton>
                    </Stack>
                  )
                }
                {
                  (categories[catName]?.addable && addFormEnabled) && (
                    <FormBuilder formFields={formCategories[catName]} onCancel={()=>setAddFormEnabled(false)} onSubmit={handleSubmit}/>
                  )
                }
                {
                  studentRecordData[catName].map( (item, i) => {
                    const isMultiple = studentRecordData[catName].length > 1;
                    return (
                      <Stack key={i} sx={{ border: `${ isMultiple ? "1px solid #ccc" : "none" }`, borderRadius: "4px", position:"relative", padding:`${ isMultiple ? "10px" : 0 }` }}>
                        <CategoryManager displayData={item} formData={formCategories[catName]} config={categories[catName]} />
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
