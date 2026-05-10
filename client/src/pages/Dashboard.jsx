        {/* ADD / UPDATE TRANSACTION */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">

            {
              editId
                ? "Update Transaction"
                : "Add New Transaction"
            }

          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="title"
              placeholder="Transaction title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
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
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
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
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
            />

            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
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


        {/* TRANSACTION LIST */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Transactions
          </h2>

          <div className="space-y-4">

            {
              filteredTransactions.length === 0 ? (

                <div className="text-center text-slate-400 py-10">
                  No transactions found
                </div>

              ) : (

                filteredTransactions.map((item) => (

                  <motion.div
                    key={item._id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >

                    <div>

                      <h3 className="text-xl font-semibold">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-sm mt-1">
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

                      {
                        item.notes && (

                          <p className="text-slate-300 mt-2">
                            {item.notes}
                          </p>

                        )
                      }

                    </div>


                    <div className="flex items-center gap-4">

                      <div
                        className={`text-xl font-bold ${
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

                  </motion.div>

                ))
              )
            }

          </div>

        </div>