"use client"

import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import {Stack, Typography} from "@mui/material";

export default function Home() {
  const router = useRouter();

  // Simulate user authentication check
  const isLoggedIn = true; // Replace with real authentication logic

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to the login page if not logged in
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return (
    <Box sx={{minHeight: "100vh"}}>
      <Stack spacing={2}>
        <Box sx={{width: "320px"}}>
          <Link href="/data-upload" aria-label="Upload file">
            <Stack spacing={2} direction="row" sx={{ alignItems: 'center', justifyContent: "space-between", boxShadow: 2, padding: "14px"}}>
              <Typography noWrap>Upload Student Data</Typography>
              <ArrowForwardIosRoundedIcon/>
            </Stack>
          </Link>
        </Box>
        <Box sx={{width: "320px"}}>
          <Link href="/student-records" aria-label="Search">
            <Stack spacing={2} direction="row" sx={{ alignItems: 'center', justifyContent: "space-between", boxShadow: 2, padding: "14px", width: "320px" }}>
              <Typography noWrap>View/Edit Student Data</Typography>
              <ArrowForwardIosRoundedIcon/>
            </Stack>
          </Link>
        </Box>
        <Box sx={{width: "320px"}}>
          <Link href="/data-download" aria-label="Download file" >
            <Stack spacing={2} direction="row" sx={{ alignItems: 'center', justifyContent: "space-between", boxShadow: 2, padding: "14px", width: "320px" }}>
              <Typography noWrap>Download Data</Typography>
              <ArrowForwardIosRoundedIcon/>
            </Stack>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}
