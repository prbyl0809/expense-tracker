import AccountBalanceWalletRounded from "@mui/icons-material/AccountBalanceWalletRounded";
import CategoryRounded from "@mui/icons-material/CategoryRounded";
import DashboardRounded from "@mui/icons-material/DashboardRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SwapHorizRounded from "@mui/icons-material/SwapHorizRounded";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { NavLink, useLocation } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    icon: <DashboardRounded />,
    to: "/app/dashboard",
  },
  {
    label: "Transactions",
    icon: <SwapHorizRounded />,
    to: "/app/transactions",
  },
  {
    label: "Categories",
    icon: <CategoryRounded />,
    to: "/app/categories",
  },
  {
    label: "Settings",
    icon: <SettingsRounded />,
    to: "/app/settings",
  },
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent() {
  const location = useLocation();

  return (
    <Stack sx={{ height: "100%" }}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          px: 2,
          py: 2.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            display: "grid",
            placeItems: "center",
            borderRadius: 3,
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            boxShadow: 3,
          }}
        >
          <AccountBalanceWalletRounded />
        </Box>
        <Box>
          <Typography variant="h6">ExpenseTracker</Typography>
          <Typography color="text.secondary" variant="body2">
            Personal finance cockpit
          </Typography>
        </Box>
      </Stack>

      <List
        disablePadding
        sx={{
          mt: 1.5,
          width: "100%",
        }}
      >
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.to;

          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={(theme) => ({
                position: "relative",
                minHeight: 54,
                width: "100%",
                borderRadius: 0,
                px: 2.5,
                bgcolor:
                  isActive && theme.palette.mode === "light"
                    ? alpha(theme.palette.primary.main, 0.12)
                    : isActive && theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.05)
                    : isActive
                      ? "secondary.main"
                      : "transparent",
                color:
                  isActive && theme.palette.mode === "light"
                    ? "primary.main"
                    : isActive && theme.palette.mode === "dark"
                      ? "text.primary"
                    : isActive
                      ? "secondary.contrastText"
                      : "text.primary",
                "&::before": isActive
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 10,
                      bottom: 10,
                      width: 4,
                      borderRadius: "0 999px 999px 0",
                      bgcolor: "primary.main",
                    }
                  : {},
                "&:hover": {
                  bgcolor:
                    isActive && theme.palette.mode === "light"
                      ? alpha(theme.palette.primary.main, 0.16)
                      : isActive && theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.08)
                      : isActive
                        ? "secondary.dark"
                        : "action.hover",
                },
              })}
            >
              <ListItemIcon
                sx={{ color: isActive ? "inherit" : "text.secondary", minWidth: 42 }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Stack>
  );
}

export function AppSidebar({ mobileOpen, onClose }: AppSidebarProps) {
  return (
    <>
      <Drawer
        open={mobileOpen}
        variant="temporary"
        onClose={onClose}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { width: 288 },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        open
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: 288,
            position: "relative",
          },
        }}
      >
        <SidebarContent />
      </Drawer>
    </>
  );
}
