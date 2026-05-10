import { useEffect, useMemo, useState } from "react";

import {
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaFileCsv,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import toast from "react-hot-toast";

import API from "../services/api";

function Dashboard() {

  const [transactions, setTransactions] =
    useState([]);

  const [categories] =
    useState([

      { name: "Salary" },
      { name: "Freelancing" },
      { name: "Food" },
      { name: "Travel" },
      { name: "Shopping" },
      { name: "Entertainment" },
      { name: "Housing" },
      { name: "Health" },
      { name: "Investments" },
      { name: "Bills" },
      { name: "Education" },
      { name: "Other" },
    ]);

  const [loading, setLoading] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [filterType, setFilterType] =
    useState("all");

  const [categoryFilter,
    setCategoryFilter] =
    useState("all");

  const [sortType, setSortType] =
    useState("latest");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [budgetAlert,
    setBudgetAlert] =
    useState(false);

  const [formData, setFormData] =
    useState({

      title: "",
      amount: "",
      type: "expense",
      category: "",
      notes: "",
      date: "",
    });


  // FETCH TRANSACTIONS
  const fetchTransactions =
    async () => {

      try {

        const response =
          await API.get(
            "/transactions"
          );

        setTransactions(
          response.data.transactions || []
        );

      } catch (error) {

        console.log(error);
      }
    };


  useEffect(() => {

    fetchTransactions();

  }, []);


  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // ADD / UPDATE TRANSACTION
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        if (editId) {

          const response =
            await API.put(

              `/transactions/${editId}`,

              formData
            );

          toast.success(
            response.data.message
          );

          setEditId(null);

        } else {

          const response =
            await API.post(

              "/transactions",

              formData
            );

          toast.success(
            response.data.message
          );
        }

        fetchTransactions();

        setFormData({

          title: "",
          amount: "",
          type: "expense",
          category: "",
          notes: "",
          date: "",
        });

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };


  // DELETE TRANSACTION
  const handleDelete =
    async (id) => {

      try {

        await API.delete(
          `/transactions/${id}`
        );

        fetchTransactions();

        toast.success(
          "Transaction deleted"
        );

      } catch (error) {

        console.log(error);
      }
    };


  // EDIT TRANSACTION
  const handleEdit = (item) => {

    setEditId(item._id);

    setFormData({

      title: item.title,

      amount: item.amount,

      type: item.type,

      category: item.category,

      notes: item.notes,

      date: item.date
        ? item.date.split("T")[0]
        : "",
    });

    window.scrollTo({

      top: 0,

      behavior: "smooth",
    });
  };


  // FILTERS
  const filteredTransactions =
    useMemo(() => {

      let filtered =
        [...transactions];

      filtered =
        filtered.filter((item) =>

          item.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );

      if (
        filterType !== "all"
      ) {

        filtered =
          filtered.filter(
            (item) =>

              item.type ===
              filterType
          );
      }

      if (
        categoryFilter !== "all"
      ) {

        filtered =
          filtered.filter(
            (item) =>

              item.category ===
              categoryFilter
          );
      }

      if (startDate) {

        filtered =
          filtered.filter(
            (item) =>

              new Date(item.date) >=
              new Date(startDate)
          );
      }

      if (endDate) {

        filtered =
          filtered.filter(
            (item) =>

              new Date(item.date) <=
              new Date(endDate)
          );
      }

      if (sortType === "latest") {

        filtered.sort(
          (a, b) =>

            new Date(b.date) -
            new Date(a.date)
        );

      } else {

        filtered.sort(
          (a, b) =>

            new Date(a.date) -
            new Date(b.date)
        );
      }

      return filtered;

    }, [

      transactions,
      search,
      filterType,
      categoryFilter,
      startDate,
      endDate,
      sortType,
    ]);


  // SUMMARY
  const totalIncome =
    transactions

      .filter(
        (item) =>
          item.type === "income"
      )

      .reduce(
        (acc, item) =>
          acc + Number(item.amount),
        0
      );


  const totalExpense =
    transactions

      .filter(
        (item) =>
          item.type === "expense"
      )

      .reduce(
        (acc, item) =>
          acc + Number(item.amount),
        0
      );


  const totalBalance =
    totalIncome - totalExpense;


  // BUDGET ALERT
  useEffect(() => {

    if (totalExpense > 30000) {

      setBudgetAlert(true);

    } else {

      setBudgetAlert(false);
    }

  }, [totalExpense]);


  // PIE CHART
  const categoryData =
    Object.values(

      filteredTransactions.reduce(
        (acc, item) => {

          if (
            item.type === "expense"
          ) {

            if (
              !acc[item.category]
            ) {

              acc[item.category] = {

                name:
                  item.category,

                value: 0,
              };
            }

            acc[item.category]
              .value += Number(
                item.amount
              );
          }

          return acc;

        },
        {}
      )
    );


  // BAR GRAPH
  const barData =
    filteredTransactions.map(
      (item) => ({

        name:
          item.title.substring(
            0,
            10
          ),

        amount:
          Number(item.amount),
      })
    );


  const COLORS = [
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];


  // CSV EXPORT
  const exportCSV = () => {

    const headers = [

      "Title",
      "Amount",
      "Type",
      "Category",
      "Date",
      "Notes",
    ];

    const rows =
      filteredTransactions.map(
        (item) => [

          item.title,

          item.amount,

          item.type,

          item.category,

          item.date
            ? new Date(item.date)
                .toLocaleDateString()
            : "",

          item.notes,
        ]
      );

    const csvContent =
      [

        headers,

        ...rows,
      ]

        .map((e) =>
          e.join(",")
        )

        .join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const link =
      document.createElement("a");

    const url =
      URL.createObjectURL(blob);

    link.setAttribute(
      "href",
      url
    );

    link.setAttribute(
      "download",
      "transactions.csv"
    );

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );
  };


  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Expense Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Smart financial tracking
            </p>

          </div>


          <div className="flex gap-3">

            <button
              onClick={exportCSV}
              className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-xl flex items-center gap-2"
            >

              <FaFileCsv />

              Export CSV

            </button>


            <button
              onClick={() => {

                localStorage.removeItem(
                  "token"
                );

                window.location.href =
                  "/";
              }}
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl flex items-center gap-2"
            >

              <FaSignOutAlt />

              Logout

            </button>

          </div>

        </div>


        {/* ALERT */}

        {
          budgetAlert && (

            <div className="bg-yellow-500 text-black rounded-2xl p-4 mb-6 flex items-center gap-3">

              <FaExclamationTriangle />

              Warning: Your expenses exceeded ₹30,000

            </div>
          )
        }


        {/* SUMMARY */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-emerald-500 p-6 rounded-3xl flex justify-between items-center">

            <div>

              <p>Total Income</p>

              <h2 className="text-4xl font-bold mt-2">
                ₹ {totalIncome}
              </h2>

            </div>

            <FaArrowUp size={40} />

          </div>


          <div className="bg-red-500 p-6 rounded-3xl flex justify-between items-center">

            <div>

              <p>Total Expense</p>

              <h2 className="text-4xl font-bold mt-2">
                ₹ {totalExpense}
              </h2>

            </div>

            <FaArrowDown size={40} />

          </div>


          <div className="bg-slate-800 p-6 rounded-3xl flex justify-between items-center">

            <div>

              <p>Total Balance</p>

              <h2 className="text-4xl font-bold mt-2">
                ₹ {totalBalance}
              </h2>

            </div>

            <FaWallet size={40} />

          </div>

        </div>


        {/* ADD TRANSACTION */}

        <div className="bg-slate-900 rounded-3xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">

            {
              editId
                ? "Edit Transaction"
                : "Add Transaction"
            }

          </h2>


          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
            >

              <option value="income">
                Income
              </option>

              <option value="expense">
                Expense
              </option>

            </select>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
            >

              <option value="">
                Select Category
              </option>

              {
                categories.map(
                  (item, index) => (

                    <option
                      key={index}
                      value={item.name}
                    >
                      {item.name}
                    </option>

                  )
                )
              }

            </select>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-semibold md:col-span-2"
            >

              {
                loading
                  ? "Processing..."
                  : editId
                  ? "Update Transaction"
                  : "Add Transaction"
              }

            </button>

          </form>

        </div>


        {/* FILTERS */}

        <div className="bg-slate-900 rounded-3xl p-6 mb-10 grid md:grid-cols-5 gap-4">

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
          />

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(
                e.target.value
              )
            }
            className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
          >

            <option value="all">
              All Types
            </option>

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expense
            </option>

          </select>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
          >

            <option value="all">
              All Categories
            </option>

            {
              categories.map(
                (item, index) => (

                  <option
                    key={index}
                    value={item.name}
                  >
                    {item.name}
                  </option>

                )
              )
            }

          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(
                e.target.value
              )
            }
            className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }
            className="bg-slate-800 rounded-xl px-4 py-3 outline-none"
          />

        </div>


        {/* CHARTS */}

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <div className="bg-slate-900 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Expense Categories
            </h2>

            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >

                    {
                      categoryData.map(
                        (entry, index) => (

                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                index %
                                COLORS.length
                              ]
                            }
                          />

                        )
                      )
                    }

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>


          <div className="bg-slate-900 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Transaction Analytics
            </h2>

            <div className="h-80">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={barData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="amount"
                    fill="#10b981"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>


        {/* TRANSACTIONS */}

        <div className="bg-slate-900 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Transactions
          </h2>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="text-left border-b border-slate-700">

                  <th className="py-4">
                    Title
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {
                  filteredTransactions.map(
                    (item) => (

                      <tr
                        key={item._id}
                        className="border-b border-slate-800"
                      >

                        <td className="py-4">
                          {item.title}
                        </td>

                        <td>
                          ₹ {item.amount}
                        </td>

                        <td className="capitalize">
                          {item.type}
                        </td>

                        <td>
                          {item.category}
                        </td>

                        <td>

                          {
                            new Date(
                              item.date
                            ).toLocaleDateString()
                          }

                        </td>

                        <td>

                          <div className="flex gap-3">

                            <button
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                              className="text-blue-400"
                            >

                              <FaEdit />

                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  item._id
                                )
                              }
                              className="text-red-400"
                            >

                              <FaTrash />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )
                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;