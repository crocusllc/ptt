"use client"

import Box from '@mui/material/Box';
import { useParams } from "next/navigation";
import {studentEnrollmentInfo, placementInfo, additionalInformation, programRequirements} from "@/app/utils/dummyData"
import {IconButton, Stack} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function StudentRecord() {
  const params = useParams();
  const slug = params.slug;
  console.log(slug)
  return (
    <>
      <h1>Student ID #: {slug}</h1>
      <Stack spacing={2} sx={{maxWidth: "768px"}}>
        <Box sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px", position: "relative"}}>
          <Box component={"h2"} sx={{marginBottom: "10px"}}>
            Student IHE Enrollment Information (Auto-Populated)
          </Box>
          <div>
            {
              Object.keys(studentEnrollmentInfo).map( (el, i) => {
                return(
                  <Stack spacing={2} key={i} direction={"row"} >
                    <Box className={"label"}>{ el }: </Box>
                    <Box className={"value"}>{studentEnrollmentInfo[el]}</Box>
                  </Stack>
                )
              })
            }
          </div>
        </Box>
        <Box sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px", position: "relative"}}>
          <Box component={"h2"} sx={{marginBottom: "10px"}}>
            Culminating Clinical Placement
          </Box>
          <Stack direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"6px"}}>
            <IconButton aria-label="add">
              <AddCircleIcon />
            </IconButton>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
          </Stack>
          <div>
            {
              Object.keys(placementInfo).map( (el, i) => {
                return(
                  <Stack spacing={2} key={i} direction={"row"} >
                    <Box className={"label"}>{ el }: </Box>
                    <Box className={"value"}>{placementInfo[el]}</Box>
                  </Stack>
                )
              })
            }
          </div>
        </Box>
        <Box sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px", position: "relative"}}>
          <Box component={"h2"} sx={{marginBottom: "10px"}}>
            Additional Program Information
          </Box>
          <Stack  direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"6px"}}>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
          </Stack>
          <div>
            {
              Object.keys(additionalInformation).map( (el, i) => {
                return(
                  <Stack spacing={2} key={i} direction={"row"} >
                    <Box className={"label"}>{ el }: </Box>
                    <Box className={"value"}>{additionalInformation[el]}</Box>
                  </Stack>
                )
              })
            }
          </div>
        </Box>
        <Box sx={{padding: "16px", border: "1px solid #ccc", borderRadius: "4px", position: "relative"}}>
          <Box component={"h2"} sx={{marginBottom: "10px"}}>
            Additional Student Information
          </Box>
          <Stack  direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"6px"}}>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
          </Stack>
          <p>Licensure Program Requirements</p>
          <div>
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
          </div>
        </Box>
      </Stack>
    </>
  );
}
