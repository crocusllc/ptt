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
import {useAuth} from "@/app/utils/contexts/AuthProvider";

export default function StudentRecordPage() {
  const { userSession } = useAuth();
  const params = useParams();
  const slug = params.slug;

  const [studentRecordData, setStudentRecordData] = useState();
  const [addFormEnabled, setAddFormEnabled] = useState(false);
  const categories = getConfigData()?.categories;

  useEffect(()=> {
    if(userSession && !studentRecordData) {
      async function fetchStudentRecordInfo() {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student_record_info`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userSession.user.accessToken}`
            },
            body: JSON.stringify({student_id: slug})
          });

          if (!response.ok) {
            console.error("HTTP Error:", response.status);
          }

          return await response.json();

        } catch (error) {
          console.error("Error fetching student record info:", error);
        }
      }

      fetchStudentRecordInfo().then(data => {
        setStudentRecordData(data);
      })
    }
  }, [userSession])

  // Get the Student Record Config Data.
  const formData = getConfigData()?.fields.find( el => el?.form?.Name === "Student Records")?.form;
  const fieldKeys =  Object.keys(formData)
  let formCategories = {}
  // Grouping fields by category.
  fieldKeys.forEach( el => {
    if(formData[el]?.Category && formData[el]?.Category !== "Global") {
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

  const handleSubmit = (data) => {
    alert("Submitted data: " + JSON.stringify(data));
  };

  return (
    <>
      <h1>Student ID #: {slug}</h1>
      <Stack spacing={2} sx={{maxWidth: "768px"}}>
        {
          studentRecordData &&
          Object.keys(categories).map( catKey => {
            return (
              <Stack spacing={2} key={catKey} sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px",  position: "relative"}}>
                <Box component={"h2"} sx={{marginBottom: "10px"}}>
                  {categories[catKey].label}
                </Box>
                {
                  (categories[catKey]?.addable && !addFormEnabled) && (
                    <Stack direction="row" sx={{position: "absolute", right:"6px", top:"10px", marginTop: "0 !important"}}>
                      <IconButton aria-label="add" onClick={()=>setAddFormEnabled(true)}>
                        <AddCircleIcon />
                      </IconButton>
                    </Stack>
                  )
                }
                {
                  (categories[catKey]?.addable && addFormEnabled) && (
                    <FormBuilder formFields={formCategories[catKey]} onCancel={()=>setAddFormEnabled(false)} onSubmit={handleSubmit}/>
                  )
                }
                {
                  studentRecordData[catKey === "additional_student_info" ? "student_info" : catKey].map( (item, i) => {
                    const isMultiple = studentRecordData[catKey === "additional_student_info" ? "student_info" : catKey].length > 1;
                    return (
                      <Stack key={i} sx={{ border: `${ isMultiple ? "1px solid #ccc" : "none" }`, borderRadius: "4px", position:"relative", padding:`${ isMultiple ? "10px" : 0 }` }}>
                        <CategoryManager displayData={item} formData={formCategories[catKey]} config={categories[catKey]} tableKey={catKey} studentId={slug}/>
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
