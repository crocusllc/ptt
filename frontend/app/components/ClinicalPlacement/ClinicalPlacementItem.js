import {useState} from "react";
import {IconButton, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import ClinicalPlacementForm from "@/app/components/ClinicalPlacement/ClinicalPlacementForm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";

export default function ClinicalPlacementItem({itemData}) {
  const [editMode, setEditMode] = useState(false);

  return (
    <Stack spacing={2} sx={{border: 1, borderColor: 'grey.300', borderRadius: "4px", position: "relative"}}>
      <Stack direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"6px"}}>
        <IconButton aria-label="edit" onClick={()=> setEditMode(true)}>
          <EditIcon />
        </IconButton>
      </Stack>
      {
        editMode
          ? <ClinicalPlacementForm onCancel={()=>setEditMode(false)}/>
          : (
            <Stack spacing={2} sx={{marginBottom: "30px", padding: "10px"}}>
              {
                Object.keys(itemData).map((el, i) => {
                  return (
                    <Stack spacing={2} key={i} direction={"row"}>
                      <Box className={"label"}>{el}:</Box>
                      <Box className={"value"}>{itemData[el]}</Box>
                    </Stack>
                  )
                })
              }
            </Stack>
          )
      }
    </Stack>
  )
}