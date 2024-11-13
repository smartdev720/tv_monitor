import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-stockcharts";

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

export const Chart = ({ data }) => {
  const [pwrs, setPwrs] = useState([]);
  const [snrs, setSnrs] = useState([]);
  const [bers, setBers] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const pr = data.map((dt) => {
        const date = new Date(dt.time);
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        return { x: localDate, y: dt.pwr };
      });
      if (data[0].snr) {
        const sr = data.map((dt) => {
          const date = new Date(dt.time);
          const localDate = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
          );
          return { x: localDate, y: dt.snr };
        });
        setSnrs(sr);
      }
      const br = data.map((dt) => {
        const date = new Date(dt.time);
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        return { x: localDate, y: dt.ber };
      });
      setPwrs(pr);
      setBers(br);
    }
  }, [data]);

  const options = {
    title: {
      text: "",
      fontColor: "white",
    },
    backgroundColor: "black",
    animationEnabled: true,
    exportEnabled: true,
    height: 700,
    charts: [
      {
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
          },
          labelFontColor: "white",
        },
        axisY: {
          crosshair: {
            enabled: true,
          },
          labelFontColor: "white",
          minimum: 0,
          maximum: 100,
          interval: 10,
        },
        data: [
          {
            type: "line",
            dataPoints: pwrs,
          },
          {
            type: "line",
            dataPoints: snrs,
          },
          {
            type: "line",
            dataPoints: bers,
          },
        ],
      },
    ],
    axisYType: "secondary",
    padding: {
      left: 50,
      right: 30,
    },
    rangeSelector: {
      enabled: false,
    },
  };

  return (
    <div>
      <CanvasJSStockChart options={options} />
    </div>
  );
};
