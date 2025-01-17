import Box from "@mui/material/Box";
import {IconButton, Stack} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {placementInfo} from "@/app/utils/dummyData";
import {useState} from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClinicalPlacementForm from "@/app/components/ClinicalPlacement/ClinicalPlacementForm";
import ClinicalPlacementItem from "@/app/components/ClinicalPlacement/ClinicalPlacementItem";

export default function ClinicalPlacement() {
  const [editMode, setEditMode] = useState(false);

  return(
    <Box sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px", position: "relative"}}>
      <Box component={"h2"} sx={{marginBottom: "10px"}}>
        Culminating Clinical Placement
      </Box>
      <Stack direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"6px"}}>
        <IconButton aria-label="add">
          <AddCircleIcon />
        </IconButton>
      </Stack>
      {
        editMode
          ? (
            <ClinicalPlacementForm onCancel={()=>setEditMode(false)}/>
          ) : (
            <Stack spacing={2}>
              {
                placementInfo.map((item, i) => {
                  return (
                    <ClinicalPlacementItem itemData={item} key={i}/>
                  )
                })
              }
            </Stack>
          )
      }
    </Box>
  )
}