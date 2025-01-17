import Box from "@mui/material/Box";
import {IconButton, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {programRequirements} from "@/app/utils/dummyData";
import {useState} from "react";
import StudentInfoForm from "@/app/components/AdditionalStudentInfo/StudentInfoForm";

export default function StudentInfo() {
  const [editMode, setEditMode] = useState(false);

  return(
    <Box sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px", position: "relative"}}>
      <Box component={"h2"} sx={{marginBottom: "10px"}}>
        Licensure Program Requirements
      </Box>
      {
        editMode
          ? (
            <StudentInfoForm onCancel={()=>setEditMode(false)}/>
          )
          :(
            <>
              <Stack  direction="row" sx={{position: "absolute", right:"6px", top:"6px"}}>
                <IconButton aria-label="edit" onClick={()=> setEditMode(true)}>
                  <EditIcon />
                </IconButton>
              </Stack>
              <Stack spacing={2}>
                {
                  Object.keys(programRequirements).map( (el, i) => {
                    return(
                      <Stack spacing={2} key={i} direction={"row"} >
                        <Box className={"label"}>{ el }: </Box>
                        <Box className={"value"}>{programRequirements[el]}</Box>
                      </Stack>
                    )
                  })
                }
              </Stack>
            </>
          )

      }
    </Box>
  )
}