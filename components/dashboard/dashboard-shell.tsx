"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Link from "@/components/link";
import { useAuth } from "@/hooks/use-auth";
import { navItems } from "./nav-items";

const DRAWER_WIDTH = 240;

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const navList = (
    <List sx={{ px: 1 }}>
      {navItems.map(({ label, href, icon: Icon }) => {
        const selected =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <ListItem key={href} disablePadding>
            <ListItemButton
              component={Link}
              href={href}
              selected={selected}
              onClick={closeMobile}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <Box sx={{ display: "flex", flex: 1, minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open navigation"
            onClick={() => setMobileOpen((open) => !open)}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component={Link}
            href="/"
            sx={{ display: "inline-flex", alignItems: "center" }}
            aria-label="DARCA Asset Management home"
          >
            <Image
              src="/darca-logo.jpeg"
              alt="DARCA Asset Management"
              width={132}
              height={36}
              priority
              style={{ height: 36, width: "auto" }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Sign out">
            <IconButton
              color="inherit"
              aria-label="Sign out"
              onClick={() => void signOut()}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeMobile}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Toolbar />
          <Divider />
          {navList}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          <Toolbar />
          <Divider />
          {navList}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
