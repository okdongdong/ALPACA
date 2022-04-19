import React from "react";
import { styled } from "@mui/material/styles"


const IconBtn = styled('span')({
  borderRadius: '100px',
  background: '#97B2E1',
  height: '50px',
  width: '50px',
})

function SideBarBtn() {
  return <IconBtn></IconBtn>;
}

export default SideBarBtn;
