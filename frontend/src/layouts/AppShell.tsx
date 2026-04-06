import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { AppTopBar } from "@/components/navigation/AppTopBar";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            pt: { xs: 2, md: 3 },
            pb: 3,
          }}
        >
          <AppTopBar onMenuClick={() => setMobileOpen(true)} />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
