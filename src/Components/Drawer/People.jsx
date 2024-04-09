import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <ChevronRightIcon
      sx={{ color: "black" }}
      onClick={onClick}
      className={className}
      {...style}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <ChevronLeftIcon
      sx={{ color: "black" }}
      onClick={onClick}
      className={className}
      {...style}
    />
  );
}

export default function OnlineProple() {
  const settings = {
    infinite: true,
    slidesToShow: 5,
    speed: 500,
    swipeToSlide: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <Box>
        
        </Box>
      </Slider>
    </div>
  );
}
