import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";
import SideBar from "../../Components/Bars/SideBar";

const MainLayout = () => {
  const APP_BAR_DESKTOP = 30;

  const RootStyle = styled("div")({
    height: "100%",
    display: "flex",
    minHeight: "100%",
    alignItems: "center",
  });

  const MainStyle = styled("div")(({ theme }) => ({
    minHeight: "50%",
    height: "100%",
    width: "100%",
    padding: APP_BAR_DESKTOP,
  }));

  const MainDiv = styled("div")({
    height: "100%",
    width: "100%",
    background: "#FFFFFF",
  });

  return (
    <RootStyle>
      <SideBar />
      <MainStyle>
        <MainDiv>
          <Outlet />
        </MainDiv>
      </MainStyle>
    </RootStyle>
  );
};

export default MainLayout;
