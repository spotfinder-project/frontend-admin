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
      label: "users",
      data: [10, 20, 30, 100, 30, 50],
    },
  ],
};

export const BarChart = () => {
  const options = {};
  return <Bar options={options} data={mockData} />;
};
