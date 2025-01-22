import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import "./globals.css";
import Header from "@/app/components/Header/Header";
import MainMenu from "@/app/components/MainMenu/MainMenu";
import Box from "@mui/material/Box";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Box sx={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "80px 1fr"
          }}>
            <Box component={"header"} sx={{gridColumn: "1 / 3"}}>
              <Header/>
            </Box>
            <Box component={"aside"} sx={{gridColumn: "1 / 2"}}>
              <MainMenu/>
            </Box>
            <Box component={"main"} sx={{gridColumn: "2 / 3", paddingBottom: "20px", paddingRight: "20px"}}>
              {children}
            </Box>
          </Box>
        </body>
      </AppRouterCacheProvider>
    </html>
  );
}
