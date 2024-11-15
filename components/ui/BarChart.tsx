"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ChartData = {
  date: string;
  count: number;
};

type Props = {
  chartData: ChartData[];
};

type Dataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
};

type Chart = {
  labels: string[];
  datasets: Dataset[];
};

export const BarChart = ({ chartData }: Props) => {
  const [chart, setChart] = useState<Chart | null>(null);
  useEffect(() => {
    setChart({
      labels: chartData.map((item) => item.date),
      datasets: [
        {
          label: "사용자 수",
          data: chartData.map((item) => item.count),
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
        },
      ],
    });
  }, [chartData]);

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  return <div>{chart && <Bar options={options} data={chart} />}</div>;
};
