import { useEffect, useMemo, useState } from "react";

import {
  FaSignOutAlt,
  FaTrash,
  FaEdit,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import toast from "react-hot-toast";

import API from "../services/api";

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

        setLoading(false);

      } catch (error) {

        setLoading(false);

        toast.error(
          error.response?.data?.message ||
          "Something went wrong"
        );

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


  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Expense Dashboard
            </h1>

            <p className="text-slate-400 mt-2 text-lg">
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


        {/* SUMMARY CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-emerald-500 p-6 rounded-3xl flex justify-between items-center">

            <div>

              <p className="text-lg">
                Total Income
              </p>

              <h2 className="text-4xl font-bold mt-2">
                ₹ {totalIncome}
              </h2>

            </div>

            <FaArrowUp size={40} />

          </div>


          <div className="bg-red-500 p-6 rounded-3xl flex justify-between items-center">

            <div>

              <p className="text-lg">
                Total Expense
              </p>

              <h2 className="text-4xl font-bold mt-2">
                ₹ {totalExpense}
              </h2>

            </div>

            <FaArrowDown size={40} />

          </div>


          <div className="bg-slate-800 p-6 rounded-3xl flex justify-between items-center">

            <div>

              <p className="text-lg">
                Total Balance
              </p>

              <h2 className="text-4xl font-bold mt-2">
                ₹ {totalBalance}
              </h2>

            </div>

            <FaWallet size={40} />

          </div>

        </div>


        {/* ADD TRANSACTION */}

        <div className="bg-slate-900 rounded-3xl p-6 mb-10">

          <h2 className="text-3xl font-bold mb-6">

            {
              editId
                ? "Update Transaction"
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
              placeholder="Transaction Title"
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

              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
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
                categories.map((cat) => (

                  <option
                    key={cat._id}
                    value={cat.name}
                  >
                    {cat.name}
                  </option>

                ))
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
              className="bg-emerald-500 hover:bg-emerald-600 rounded-xl py-3 font-semibold md:col-span-2"
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

        <div className="bg-slate-900 rounded-3xl p-6 mb-10">

          <h2 className="text-3xl font-bold mb-6">
            Search & Filters
          </h2>

          <div className="grid md:grid-cols-6 gap-4">

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="bg-slate-800 rounded-xl px-4 py-3"
            />

            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value
                )
              }
              className="bg-slate-800 rounded-xl px-4 py-3"
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
              className="bg-slate-800 rounded-xl px-4 py-3"
            >

              <option value="all">
                All Categories
              </option>

              {
                categories.map((cat) => (

                  <option
                    key={cat._id}
                    value={cat.name}
                  >
                    {cat.name}
                  </option>

                ))
              }

            </select>

            <select
              value={sortType}
              onChange={(e) =>
                setSortType(
                  e.target.value
                )
              }
              className="bg-slate-800 rounded-xl px-4 py-3"
            >

              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="high">
                Highest
              </option>

              <option value="low">
                Lowest
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
              className="bg-slate-800 rounded-xl px-4 py-3"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="bg-slate-800 rounded-xl px-4 py-3"
            />

          </div>

        </div>


        {/* TRANSACTIONS */}

        <div className="bg-slate-900 rounded-3xl p-6">

          <h2 className="text-3xl font-bold mb-6">
            Transactions
          </h2>

          <div className="space-y-4">

            {
              filteredTransactions.length > 0
              ? (
                filteredTransactions.map((item) => (

                  <div
                    key={item._id}
                    className="bg-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                  >

                    <div>

                      <h3 className="text-xl font-semibold">
                        {item.title}
                      </h3>

                      <p className="text-slate-400">
                        {item.category}
                      </p>

                      <p className="text-slate-500 text-sm">

                        {
                          item.date
                          ? new Date(item.date)
                              .toLocaleDateString()
                          : ""
                        }

                      </p>

                    </div>


                    <div className="flex items-center gap-4">

                      <div
                        className={`text-2xl font-bold ${
                          item.type === "income"
                          ? "text-emerald-400"
                          : "text-red-400"
                        }`}
                      >

                        ₹ {item.amount}

                      </div>


                      <button
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="bg-blue-500 hover:bg-blue-600 p-3 rounded-xl"
                      >

                        <FaEdit />

                      </button>


                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        className="bg-red-500 hover:bg-red-600 p-3 rounded-xl"
                      >

                        <FaTrash />

                      </button>

                    </div>

                  </div>

                ))
              )
              : (

                <div className="text-center text-slate-400 py-10">

                  No transactions found

                </div>

              )
            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;