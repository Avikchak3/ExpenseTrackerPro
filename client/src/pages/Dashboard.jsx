import ExpenseChart from "../components/ExpenseChart";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaSignOutAlt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import toast from "react-hot-toast";

import API from "../services/api";

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


function Dashboard() {

  const [transactions, setTransactions] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

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


  // FETCH CATEGORIES
  const fetchCategories =
    async () => {

      try {

        const response =
          await API.get(
            "/categories"
          );

        setCategories(
          response.data.categories || []
        );

      } catch (error) {

        console.log(error);
      }
    };


  useEffect(() => {

    fetchTransactions();

    fetchCategories();

  }, []);


  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };


  // ADD OR UPDATE
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

        setLoading(false);

      } catch (error) {

        setLoading(false);

        console.log(error);
      }
    };


  // DELETE
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


  // EDIT
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


  // FILTER + SEARCH + SORT
  const filteredTransactions =
    useMemo(() => {

      let filtered =
        [...transactions];

      // SEARCH
      filtered =
        filtered.filter((item) =>

          item.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );

      // FILTER TYPE
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

      // CATEGORY FILTER
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

      // DATE FILTER
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

      // SORT
      if (
        sortType === "latest"
      ) {

        filtered.sort(
          (a, b) =>

            new Date(b.date) -
            new Date(a.date)
        );

      } else if (
        sortType === "oldest"
      ) {

        filtered.sort(
          (a, b) =>

            new Date(a.date) -
            new Date(b.date)
        );

      } else if (
        sortType === "high"
      ) {

        filtered.sort(
          (a, b) =>

            b.amount -
            a.amount
        );

      } else if (
        sortType === "low"
      ) {

        filtered.sort(
          (a, b) =>

            a.amount -
            b.amount
        );
      }

      return filtered;

    }, [

      transactions,

      search,

      filterType,

      categoryFilter,

      sortType,

      startDate,

      endDate,
    ]);


  // TOTALS
  const totalIncome =
    transactions

      .filter(
        (item) =>
          item.type === "income"
      )

      .reduce(
        (acc, item) =>
          acc + item.amount,
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
          acc + item.amount,
        0
      );


  const totalBalance =
    totalIncome - totalExpense;


  // CATEGORY CHART
  const categoryData =
    Object.values(

      transactions.reduce(
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
              .value += item.amount;
          }

          return acc;

        },
        {}
      )
    );


  // MONTHLY CHART
  const monthlyData =
    Object.values(

      transactions.reduce(
        (acc, item) => {

          const month =
            new Date(
              item.date
            ).toLocaleString(
              "default",
              {
                month: "short",
              }
            );

          if (!acc[month]) {

            acc[month] = {

              month,

              amount: 0,
            };
          }

          acc[month].amount +=
            item.amount;

          return acc;

        },
        {}
      )
    );


  const COLORS = [
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];


  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-4xl font-bold">
              Expense Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Track your money smartly
            </p>

          </div>


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


        {/* SUMMARY */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="bg-emerald-500 p-6 rounded-3xl shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div>

                <p>Total Income</p>

                <h2 className="text-3xl font-bold mt-2">
                  ₹ {totalIncome}
                </h2>

              </div>

              <FaArrowUp className="text-3xl" />

            </div>

          </motion.div>


          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="bg-red-500 p-6 rounded-3xl shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div>

                <p>Total Expense</p>

                <h2 className="text-3xl font-bold mt-2">
                  ₹ {totalExpense}
                </h2>

              </div>

              <FaArrowDown className="text-3xl" />

            </div>

          </motion.div>


          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-xl"
          >

            <div className="flex items-center justify-between">

              <div>

                <p>Total Balance</p>

                <h2 className="text-3xl font-bold mt-2">
                  ₹ {totalBalance}
                </h2>

              </div>

              <FaWallet className="text-3xl text-emerald-400" />

            </div>

          </motion.div>

        </div>


        {/* CHARTS */}

        <div className="grid lg:grid-cols-2 gap-8 mb-10">

          <ExpenseChart
            income={totalIncome}
            expense={totalExpense}
          />


          {/* CATEGORY CHART */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Category Wise Expenses
            </h2>


            <ResponsiveContainer
              width="100%"
              height={300}
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
                      (
                        entry,
                        index
                      ) => (

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


        {/* MONTHLY CHART */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Monthly Spending Chart
          </h2>


          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={monthlyData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="amount"
                fill="#10b981"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* FILTERS */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Search & Filters
          </h2>


          <div className="grid md:grid-cols-6 gap-4">

            <input
              type="text"
              placeholder="Search transaction..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />


            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            >

              <option value="all">
                All
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
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            >

              <option value="all">
                All Categories
              </option>

              {
                categories.map(
                  (cat) => (

                    <option
                      key={cat._id}
                      value={cat.name}
                    >
                      {cat.name}
                    </option>
                  )
                )
              }

            </select>


            <select
              value={sortType}
              onChange={(e) =>
                setSortType(
                  e.target.value
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            >

              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="high">
                Highest Amount
              </option>

              <option value="low">
                Lowest Amount
              </option>

            </select>


            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />


            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;