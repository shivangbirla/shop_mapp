import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const QuadrantChart = () => {
  const quadrantChartRef = useRef(null);
  const [apiD, setApiD] = useState();

  useEffect(() => {
    const apiData = () => {
      fetch(
        "https://script.googleusercontent.com/macros/echo?user_content_key=7AQSgSdnncPnhV8qT3KrkodZvmi0H_e-G6VungOg68lsSA_Pw43x8XhgP1NNRbzKm0WSUjdtVqcj6Pst931KfnkGCrnPa-r9m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnB8n10PVrbg8Vv4jrzmsm5JPaa8lSYayO-D-S_VBMfOpuYe7tUVdkrENOPmQUsOyQ4yilBNGBylvEpZOUXnulzsX_xDhbwqYIg&lib=MYh46KwtR1PGqq2iJu_X2srTH389liFSA"
      )
        .then((res) => res.json())
        .then((data) => setApiD(data.data));
    };

    apiData();
  }, []);

  useEffect(() => {
    const quadrantChartCanvas = quadrantChartRef.current.getContext("2d");
    const existingChart = Chart.getChart(quadrantChartCanvas);

    // Destroy the existing chart if it exists
    if (existingChart) {
      existingChart.destroy();
    }

    if (apiD) {
      const data = {
        labels: apiD.map((item) => item.store_name),
        datasets: [
          {
            label: "pixel_6",
            data: apiD.map((item) => ({
              x: parseFloat(item.Total_Sales),
              y: parseFloat(item.Quadrant_Plot),
              label: item.store_name,
            })),
            borderColor: "red",
            backgroundColor: "green",
          },
          // {
          //   label: "pixel_6A",
          //   data: apiD.map((item) => ({
          //     x: parseFloat(item.pixel_7_pro_cycle),
          //     y: parseFloat(item.pixel_7_pro),
          //     label: item.store_name,
          //   })),
          //   borderColor: "yellow",
          //   backgroundColor: "orange",
          // },
        ],
      };

      const options = {
        plugins: {
          quadrants: {
            topLeft: "#BAF2E9",
            topRight: "#B0F2B4",
            bottomRight: "#F2BAC9",
            bottomLeft: "#BAD7F2",
          },
        },
        tooltips: {
          callbacks: {
            label: (context) => {
              const storeName =
                data.datasets[context.datasetIndex].data[context.dataIndex]
                  .label;
              return `Store Name: ${storeName}`;
            },
          },
        },
      };

      const quadrants = {
        id: "quadrants",
        beforeDraw(chart, args, options) {
          const {
            ctx,
            chartArea: { left, top, right, bottom },
            scales: { x, y },
          } = chart;
          const midX = x.getPixelForValue(0);
          const midY = y.getPixelForValue(0);
          ctx.save();
          ctx.fillStyle = options.topLeft;
          ctx.fillRect(left, top, midX - left, midY - top);
          ctx.fillStyle = options.topRight;
          ctx.fillRect(midX, top, right - midX, midY - top);
          ctx.fillStyle = options.bottomRight;
          ctx.fillRect(midX, midY, right - midX, bottom - midY);
          ctx.fillStyle = options.bottomLeft;
          ctx.fillRect(left, midY, midX - left, bottom - midY);
          ctx.restore();
        },
      };

      const quadrantChart = new Chart(quadrantChartCanvas, {
        type: "scatter",
        data: data,
        options: options,
        plugins: [quadrants],
      });
    }
  }, [apiD]);

  return (
    <div className="container pt-10 flex justify-center items-center">
      <canvas
        id="quadrantChart"
        ref={quadrantChartRef}
        width="200"
        height="200"
      ></canvas>
    </div>
  );
};

export default QuadrantChart;
