"use client"

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import getConfigData from "@/app/utils/getConfigs";
import FormBuilder from "@/app/(pages)/student-records/[slug]/FormBuilder";
import {SessionProvider, useSession} from "next-auth/react";


function DownloadDataForm() {
  const { data: session } = useSession();
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
  const handleDownloadAll = async () => {
    {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file_download`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.user.accessToken}`
          },
          body: JSON.stringify({"file_name": "all_records.csv", fields: []}),
        });

        if (!response.ok) {
          console.error("HTTP Error:", response.status);
        }

        // Get the file content
        const blob = await response.blob();

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

  const handleDownloadSelected = (data) => {
    alert("Downloading selected records with filters: " + JSON.stringify(data));
  };

  return (
    <Box sx={{ maxWidth: "600px"}}>
      <Box sx={{ marginBottom: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <Typography variant="h6">Download All Records:</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadAll}
          sx={{ marginTop: "8px" }}
        >
          Download
        </Button>
      </Box>

      <Box sx={{ marginBottom: "16px", padding: "16px", border: "1px solid #ccc", borderRadius: "4px" }}>
        <Typography variant="h6" gutterBottom>
          Download Selected Records:
        </Typography>

        <FormBuilder formFields={downLoadFormFields} submitBtnTxt={"Download"} onSubmit={handleDownloadSelected}/>
      </Box>
    </Box>
  );
};
export default function DownLoadRecordsPage() {
  return (
    <SessionProvider>
      <DownloadDataForm />
    </SessionProvider>
  );
}