"use client"

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import {useState} from "react";
import FileUploadForm from "@/app/(pages)/data-upload/FileUploadForm";
import {Stack} from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Stack spacing={2}>
      <Card sx={{ maxWidth: 480, width: "80%" }}>
        <CardContent>
          <FileUploadForm title={"Upload/Update Student IHE Data:"}/>
        </CardContent>
      </Card>
      <Card sx={{ maxWidth: 480, width: "80%" }}>
        <CardContent>
          <FileUploadForm title={"Upload new clinical placement data:"}/>
        </CardContent>
      </Card>
      <Card sx={{ maxWidth: 480, width: "80%" }}>
        <CardContent>
          <FileUploadForm title={"Upload new program and student data:"}/>
        </CardContent>
      </Card>
      <Link href={"/upload-log"} aria-label={"Upload Log"}>View Upload Log</Link>
    </Stack>
  );
}
