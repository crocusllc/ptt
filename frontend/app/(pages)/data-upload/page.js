"use client"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FileUploadForm from "@/app/(pages)/data-upload/FileUploadForm";
import Stack from "@mui/material/Stack";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Link from "next/link";
import HelpBox from "@/app/components/HelpBox/HelpBox";
import Box from "@mui/material/Box";
import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded';
import {ListItemButton} from "@mui/material";

const templatePaths = [
  {
    name: "IHE Data Template",
    path: "/docs/ihe-data-template.csv"
  },
  {
    name: "Clinical Placement Data Template",
    path: "/docs/clinical-placement-data-template.csv"
  },
  {
    name: "Program and Student Data Template",
    path: "/docs/program-student-data-template.csv"
  },
  {
    name: "Reference Guide",
    path: "#"
  }
]

const uploadForms = [
  "Upload/Update Student IHE Data:",
  "Upload new clinical placement data:",
  "Upload new program and student data:",
  "Upload new program and student data:"
]

export default function UploadPage() {
  return (
    <Stack spacing={2} maxWidth={"md"} margin={"auto"}>
      <Box sx={{marginLeft: "auto !important", width:"40px"}}>
        <HelpBox>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
            {
              templatePaths.map((template, i)=> {
                return (
                  <ListItem key={i} disablePadding>
                    <ListItemButton component="a" href={template.path} download>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <SaveAltRoundedIcon fontSize={"small"}/>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={ template.name } />
                    </ListItemButton>
                  </ListItem>
                )
              })
            }
          </List>
        </HelpBox>
      </Box>

      {
        uploadForms.map( (formTitle, i)=> {
          return(
            <Card key={i} sx={{ width: "90%", margin: "auto"}}>
              <CardContent>
                <FileUploadForm title={formTitle}/>
              </CardContent>
            </Card>
          )
        })
      }
      <Link href={"/upload-log"} aria-label={"Upload Log"}>View Upload Log</Link>
    </Stack>
  );
}
