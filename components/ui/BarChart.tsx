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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const mockData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
  datasets: [
    {
      label: "사용자 수",
      data: [10, 20, 30, 100, 30, 50],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgba(54, 162, 235, 1)",
    },
  ],
};

export const BarChart = () => {
  const options = {
    responsive: true,
  };
  return <Bar options={options} data={mockData} />;
};
