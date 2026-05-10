import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ExpenseChart({
  income,
  expense,
}) {

  const data = {

    labels: [
      "Income",
      "Expense",
    ],

    datasets: [
      {
        data: [
          income,
          expense,
        ],

        backgroundColor: [
          "#10b981",
          "#ef4444",
        ],

        borderWidth: 0,
      },
    ],
  };


  const options = {

    plugins: {

      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };


  return (

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">

      <h2 className="text-2xl font-bold mb-6 text-white">
        Expense Analytics
      </h2>

      <Doughnut
        data={data}
        options={options}
      />

    </div>
  );
}

export default ExpenseChart;