import {IconButton, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import FormBuilder from "@/app/(pages)/student-records/[slug]/FormBuilder";
import {useAuth} from "@/app/utils/contexts/AuthProvider";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function CategoryManager({displayData, formData, config, tableKey, studentId, onFetch, addable}) {
  const { userSession } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMonde] = useState(false)

  const handleSubmit = async (data) => {
    const source_to_table = {
      "additional_student_info": "additional_student_data",
      "student_info": "student",
      "program_info": "additional_program_data",
      "clinical_placements": "clinical"
    }

    //alert("Submitted data: " + JSON.stringify(data));
    const postData = {
      student_id: studentId,
      source: source_to_table[tableKey], // This determines which table is updated
      ...data,
    }

    if(displayData?.id) {
      postData['id'] = displayData.id;
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
      setEditMode(false);
      setAddMonde(false);
      onFetch && onFetch();

    } catch (error) {
      console.error("Error fetching student record info:", error);
    }
  };

  return (
    (editMode || addMode)
      ? <FormBuilder formFields={formData} onCancel={()=>{setEditMode(false); setAddMonde(false)}} defaultData={displayData} onSubmit={handleSubmit}/>
      : (
        <>
          {
            (addable && userSession && userSession.user.role !== 'viewer') && (
              <Stack direction="row" sx={{position: "absolute", right:"6px", top:"10px", marginTop: "0 !important"}}>
                <IconButton aria-label="add" onClick={()=>setAddMonde(true)}>
                  <AddCircleIcon />
                </IconButton>
              </Stack>
            )
          }
          {
            displayData && (
              (formData)?.map( (el, i) => {
                const fieldDef = Object.keys(displayData).filter( field => el['CSV column name'] === field)[0];
                if(fieldDef) {
                  return(
                    <Stack spacing={1} key={i}>

                      <Stack direction="row" spacing={1} sx={{position: "absolute", right:"6px", top:"4px"}}>
                        {
                          (config?.editable && userSession && userSession.user.role !== 'viewer') && (
                            <IconButton aria-label="edit" onClick={()=> setEditMode(true)}>
                              <EditIcon />
                            </IconButton>
                          )
                        }
                      </Stack>
                      <Stack spacing={2} key={i} direction={"row"} >
                        <Box className={"label"}>{ el['Data element label'] }: </Box>
                        <Box className={"value"}>{displayData[el['CSV column name']]}</Box>
                      </Stack>
                    </Stack>
                  )
                }
              })
            )
          }
        </>
      )
  )
}