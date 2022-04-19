import React from "react";
import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";

const RootStyle = styled("div")({
  height: "100%",
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  justifyContent: "center",
});

function AccountLayout() {
  return (
    <RootStyle>
      <Outlet />
    </RootStyle>
  );
}

export default AccountLayout;
