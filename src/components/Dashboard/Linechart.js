import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./Linechart.css";
import useGeckoData from "./../ApiBinance/Gecko-data";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(...registerables, annotationPlugin, zoomPlugin);

function App({ crypto, bought_price }) {
  const [time, price, is_ready] = useGeckoData(crypto);
  const [options, setOptions] = React.useState();
  const line_chart_ref = React.useRef();

  React.useEffect(() => {
    if (line_chart_ref?.current) {
      line_chart_ref?.current?.chartInstance?.destroy();
    }

    if (time && price) {
      const new_options = {
        scales: {
          x: {
            min: time[time.length - 10],
          },
          y: {
            min: () => {
              Math.min(price);
            },
            max: () => {
              Math.max(price);
            },
          },
        },
        plugins: {
          autocolors: false,
          legend: {
            display: false,
          },
          annotation: {
            annotations: {
              line1: {
                type: "line",
                yScaleId: "yAxis",
                yMin: bought_price,
                yMax: bought_price,
                borderColor: "rgb(255, 99, 132)",
                borderWidth: 2,
                label: {
                  content: bought_price,
                  enabled: true,
                  position: "right",
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          zoom: {
            pan: {
              enabled: true,
              drag: true,
              mode: "x",
              speed: 10,
              threshold: 10,
              rangeMin: {
                x: -365,
              },
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "x",
            },
            animation: {
              duration: 0,
            },
          },
        },
      };

      setOptions((prev) => ({ ...prev, ...new_options }));
    }
  }, [crypto]);

  if (!is_ready) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="app">
      <div className="line-chart-container">
        <Line
          key={crypto + bought_price}
          ref={line_chart_ref}
          className="line-dash"
          data={{
            labels: time,
            datasets: [
              {
                data: price,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.1)",
                borderColor: "rgba(75,192,192,1)",
                pointRadius: 4,
              },
            ],
          }}
          options={options}
          redraw
        />
      </div>
    </div>
  );
}

export default App;
