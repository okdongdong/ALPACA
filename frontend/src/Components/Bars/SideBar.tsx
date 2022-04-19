import React from "react";
import { styled } from "@mui/material/styles";
import { Drawer, List, ListItemButton, ListItemIcon } from "@mui/material";
import Logo from "../../Assets/Img/Logo.png";

import styles from "./SideBar.module.css";
import SideBarBtn from "./SideBarBtn";

import { Logout } from "@mui/icons-material";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 90,
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const CustomDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: 90,
  height: "100%",
  background: "#FFFFFF",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

function SideBar() {
  return (
    <CustomDrawer variant="permanent">
      <DrawerHeader>
        <img src={Logo} className={styles.logo} alt="" />
      </DrawerHeader>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItemButton
            key={text}
            sx={{
              minHeight: 48,
              justifyContent: "center",
              alignItems: "center",
              mx: "auto",
              my: "10px",
              px: 2.5,
              borderRadius: "100px",
              background: "#97B2E1",
              height: "50px",
              width: "50px",
              '&:hover': {
                background: '#97B2E1' + '90'
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: "center",
                color: "#FFFFFF",
              }}
            >
              <Logout />
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </CustomDrawer>
  );
}
export default SideBar;
