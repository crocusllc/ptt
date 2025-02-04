"use client"
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import getConfigData from "@/app/utils/getConfigs";
import FormBuilder from "@/app/(pages)/student-records/[slug]/FormBuilder";
import {useAuth} from "@/app/utils/contexts/AuthProvider";

export default function DownloadDataPage() {
  const { userSession } = useAuth();

  const studentRecordFormFields = getConfigData()?.fields
    ?.find( el => el?.form?.Name === "Student Records")?.form;

  const studentRecordKeys = Object.keys(studentRecordFormFields);

  let downLoadFormFields = [];

  studentRecordKeys.forEach( el => {
    if(studentRecordFormFields[el]['Use as filter on Download page?']){
      downLoadFormFields.push(studentRecordFormFields[el])
    }
  });

  // Handle download actions
  const handleDownload = async (fieldsSelected) => {
    {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file_download`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userSession.user.accessToken}`
          },
          body: JSON.stringify({"file_name": "all_records.csv", fields: fieldsSelected?.length ? fieldsSelected : ["*"]}),
        });

        if (!response.ok) {
          console.error("HTTP Error:", response.status);
        }


        // Get the file content
        // Ensure the file content is read as text with UTF-8 encoding
        const text = await response.text();
        // Convert text to a Blob with proper encoding
        const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });


        // Create a download link
        const urlObject = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = urlObject;
        link.download = "all_records.csv";
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlObject);
      } catch (error) {
        console.error("Error fetching student record info:", error);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: "600px"}}>
      <Box sx={{ marginBottom: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <Typography variant="h6">Download All Records:</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={()=>handleDownload([])}
          sx={{ marginTop: "8px" }}
        >
          Download
        </Button>
      </Box>

      <Box sx={{ marginBottom: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <Typography variant="h6" gutterBottom>
          Download Selected Records:
        </Typography>

        <FormBuilder formFields={downLoadFormFields} submitBtnTxt={"Download"} onSubmit={handleDownload}/>
      </Box>
    </Box>
  );
};
