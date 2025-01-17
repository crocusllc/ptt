"use client"

import Box from '@mui/material/Box';
import { useParams } from "next/navigation";
import {studentEnrollmentInfo, placementInfo, additionalInformation, programRequirements} from "@/app/utils/dummyData"
import {IconButton, Stack} from "@mui/material";
import AdditionalProgramInfo from "@/app/components/AdditionalProgramInfo/ProgramInformation";
import AdditionalStudentInfo from "@/app/components/AdditionalStudentInfo/StudentInfo";
import ClinicalPlacement from "@/app/components/ClinicalPlacement/ClinicalPlacement";

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

        <ClinicalPlacement/>
        <AdditionalProgramInfo/>
        <AdditionalStudentInfo/>
      </Stack>
    </>
  );
}
