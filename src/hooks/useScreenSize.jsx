import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";

const useScreenSize = () => {
  const [isExtraSmall, setExtraSmall] = useState(false);
  const [isSmall, setSmall] = useState(false);
  const [isMedium, setMedium] = useState(false);
  const [isLarge, setLarge] = useState(false);

  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    const handleResize = () => {
      setExtraSmall(false);
      setSmall(false);
      setMedium(false);
      setLarge(false);
      if (isExtraSmallScreen) {
        setExtraSmall(true);
      } else if (isSmallScreen) {
        setSmall(true);
      } else if (isMediumScreen) {
        setMedium(true);
      } else if (isLargeScreen) {
        setMedium(true);
      } else {
        setLarge(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isExtraSmallScreen, isSmallScreen, isMediumScreen, isLargeScreen]);

  return { isExtraSmall, isSmall, isMedium, isLarge };
};

export default useScreenSize;
