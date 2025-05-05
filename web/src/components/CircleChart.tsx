import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

// Реєстрація компонентів Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const CircleChart = ({
  value1,
  value2,
  label1,
  label2,
}: {
  value1: number;
  value2: number;
  label1: string;
  label2: string;
}) => {
  const isNull = value1 == 0 && value2 == 0;
  const data = {
    labels: [label1, label2],
    datasets: [
      {
        data: [value1, value2],
        backgroundColor: ["#6BCEBC", "#F1F6B5"],
        borderColor: ["#6BCEBC", "#F1F6B5"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,

          boxWidth: 20,
          padding: 15,

          generateLabels: (chart: any) => {
            const data = chart.data;
            return data.labels.map((label: string, i: number) => {
              // Витягнемо відсотки
              const percentage = (
                (data.datasets[0].data[i] /
                  data.datasets[0].data.reduce(
                    (a: number, b: number) => a + b
                  )) *
                100
              ).toFixed(0);

              return {
                text: `${label} ${percentage == "NaN" ? 0 : percentage}%`,
                fillStyle: data.datasets[0].backgroundColor[i],
                borderWidth: 0,
                font: {
                  weight: i === 0 ? "normal" : "bold",
                },
              };
            });
          },
        },
      },
    },
  };

  return isNull ? <p>Немає даних</p> : <Pie data={data} options={options} />;
};

export default CircleChart;
