import getConfigData from "@/app/utils/getConfigs"
import Box from "@mui/material/Box";
import {IconButton, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {student_record_info} from "@/app/utils/dummyData";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function StudentRecordForm(){
  const [studentRecord, setStudentRecord] = useState();

  useEffect(()=> {
    // Fetch fn here
    setStudentRecord(student_record_info);
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

  return(
    <Stack spacing={2}>
      {
        studentRecord &&
          Object.keys(studentRecord).map( catName => {
          return (
            <Box key={catName} sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px", position: "relative"}}>
              <Box component={"h2"} sx={{marginBottom: "10px"}}>
                {catName}
              </Box>
              <Stack direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"6px"}}>
                <IconButton aria-label="add">
                  <AddCircleIcon />
                </IconButton>
              </Stack>
            </Box>
          )
        })





        // Object.keys(formCategories).map( cat => {
        //   return (
        //     <Box key={cat} sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px", position: "relative"}}>
        //       <div>
        //         data del fetch
        //       </div>
        //       <Box component={"h2"} sx={{marginBottom: "10px"}}>
        //         { cat }
        //       </Box>
        //     </Box>
        //   )
        // })
      }
    </Stack>
  )
}