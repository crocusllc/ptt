import {IconButton, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import FormBuilder from "@/app/(pages)/student-records/[slug]/FormBuilder";
import {useAuth} from "@/app/utils/contexts/AuthProvider";

export default function CategoryManager({displayData, formData, config, tableKey, studentId}) {
  const { userSession } = useAuth();
  const [editMode, setEditMode] = useState(false);
  // Render data on login is the data from student DB, after edit render data is updated with the modified data.
  const [renderData, setRenderData] = useState(displayData)
  const handleSubmit = async (data) => {
    const source_to_table = {
      "additional_student_info": "additional_student_data",
      "student_info": "student",
      "program_info": "additional_program_data",
      "clinical_placements": "clinical"
    }
    //alert("Submitted data: " + JSON.stringify(data));
    const postData = {
      id: displayData.id,  // Optional, include for updates
      student_id: studentId,
      source: source_to_table[tableKey], // This determines which table is updated
      ...data,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userSession.user.accessToken}`
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        console.error("HTTP Error:", response.status);
      }

      const res = await response.json();
      // Passing the form data modified to
      setRenderData(data);
      setEditMode(false);

    } catch (error) {
      console.error("Error fetching student record info:", error);
    }
  };

  return (
    editMode
      ? <FormBuilder formFields={formData} onCancel={()=>setEditMode(false)} defaultData={renderData} onSubmit={handleSubmit}/>
      : (
        Object.keys(renderData)?.map( (el, i) => {
          const fieldDef = formData.filter( field => field['CSV column name'] === el)[0];
          if(fieldDef) {
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
                  <Box className={"label"}>{ fieldDef['Data element label'] }: </Box>
                  <Box className={"value"}>{renderData[el]}</Box>
                </Stack>
              </Stack>
            )
          }
        })
      )
  )
}