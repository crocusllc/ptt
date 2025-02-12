"use client"
import { Box, Stack } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Link from "next/link";
import { usePathname } from 'next/navigation'
import {useAuth} from "@/app/utils/contexts/AuthProvider";

export default function MainMenu() {
  const pathname = usePathname();
  const { userSession } = useAuth();
  const allowed = userSession && userSession.user?.role === 'administrator'

  const menuItems = [
    { href: "/", icon: <HomeIcon />, label: "Home" },
    { href: "/data-upload", icon: <FileUploadIcon />, label: "Upload file", protected: true },
    { href: "/student-records", icon: <SearchIcon />, label: "Search" },
    { href: "/data-download", icon: <FileDownloadIcon />, label: "Download file", protected: true }
  ]

  return (
    <Box
      sx={{
        width: "60px",
        backgroundColor: "#f4f4f4",
      }}
    >
      {
        <Stack component={"nav"} alignItems="center">
          {menuItems.filter(item => !item.protected || allowed).map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`link ${pathname === href ? "active" : ""}`}
              style={{ padding: "18px", borderRadius: "50%" }}
              aria-label={label}
            >
              {icon}
            </Link>
          ))}
        </Stack>
      }

    </Box>
  );
}