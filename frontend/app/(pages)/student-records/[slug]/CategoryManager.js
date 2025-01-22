import {IconButton, Stack} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";

export default function CategoryManager({displayData, formFields, config}) {
  console.log(config)
  const [editMode, setEditMode] = useState(false);

  return (
    editMode
      ? <div>Acá el form</div>
      : (
        Object.keys(displayData).map( (el, i) => {
          return(
            <Stack spacing={1} key={i}>
              <Stack direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"6px"}}>
                {
                  config?.edit && (
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