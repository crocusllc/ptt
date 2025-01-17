import { Box, Stack } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Link from "next/link";

export default function MainMenu({currentPath}) {

  return (
    <Box
      sx={{
        width: "60px",
        backgroundColor: "#f4f4f4",
      }}
    >
      {/* Stack for menu items */}
      <Stack component={"nav"} alignItems="center">
        <Link style={{padding: "18px", borderRadius: "50%"}} className={`link ${currentPath === '/' ? 'active' : ''}`} href="/" aria-label="Home"><HomeIcon /></Link>
        <Link style={{padding: "18px", borderRadius: "50%"}} className={`link ${currentPath === '/data-upload' ? 'active' : ''}`} href="/data-upload" aria-label="Upload file"> <FileUploadIcon /></Link>
        <Link style={{padding: "18px", borderRadius: "50%"}} className={`link ${currentPath === '/student-records' ? 'active' : ''}`} href="/student-records" aria-label="Search"> <SearchIcon /></Link>
        <Link style={{padding: "18px", borderRadius: "50%"}} className={`link ${currentPath === '/data-download' ? 'active' : ''}`} href="/data-download" aria-label="Download file"><FileDownloadIcon /></Link>
      </Stack>
    </Box>
  );
}