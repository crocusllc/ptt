import {IconButton, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import FormBuilder from "@/app/(pages)/student-records/[slug]/FormBuilder";

export default function CategoryManager({displayData, formData, config}) {
  const [editMode, setEditMode] = useState(false);

  const handleSubmit = (data) => {
    alert("Submitted data: " + JSON.stringify(data));
  };

  return (
    editMode
      ? <FormBuilder formFields={formData} onCancel={()=>setEditMode(false)} defaultData={displayData} onSubmit={handleSubmit}/>
      : (
        Object.keys(displayData).map( (el, i) => {
          return(
            <Stack spacing={1} key={i}>
              <Stack direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"4px"}}>
                {
                  config?.editable && (
                    <IconButton aria-label="edit" onClick={()=> setEditMode(true)}>
                      <EditIcon />
                    </IconButton>
                  )
                }
              </Stack>
              <Stack spacing={2} key={i} direction={"row"} >
                <Box className={"label"}>{ el }: </Box>
                <Box className={"value"}>{displayData[el]}</Box>
              </Stack>
            </Stack>
          )
        })
      )
  )
}