import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import useBinanceData from "../ApiBinance/binance-data";

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
  
`);

const RenderCard = ({ pair, src, name }) => {
  const [, , , , , close, , , percent] = useBinanceData(pair);
  return (
    <Card sx={{ maxWidth: 195, maxHeight: 125, borderRadius: 3 }}>
      <CardHeader
        className="card-header"
        sx={{ height: 30, bgcolor: "#2D2C56" }}
        avatar={
          <Avatar
            src={src}
            sx={{ bgcolor: "#2D2C56", width: 40, height: 40 }}
          />
        }
        titleTypographyProps={{
          fontSize: 14,
          align: "left",
          color: "white",
        }}
        subheaderTypographyProps={{
          fontSize: 14,
          fontWeight: 700,
          color: "white",
        }}
        title={name}
        subheader="12"
      />

      <CardContentNoPadding sx={{ bgcolor: "#2D2C56" }}>
        <div className="card-content">
          <div className="card-col card-col-l">
            <p>24h %</p>
            <p>Profit/Loss</p>
            <p>Bought price</p>
          </div>
          <div className="card-col card-col-r">
            <p
              className={`coin-precentage ${
                Number.parseFloat(percent) > 0 ? "green" : "red"
              }`}
            >
              {Number.parseFloat(percent).toFixed(2)}%
            </p>
            <p>1231231</p>
            <p></p>
          </div>
        </div>
      </CardContentNoPadding>
    </Card>
  );
};

export default RenderCard;
