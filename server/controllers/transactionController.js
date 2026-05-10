const Transaction =
  require("../models/Transaction");


// ADD TRANSACTION
const addTransaction =
  async (req, res) => {

    try {

      const {
        title,
        amount,
        type,
        category,
        notes,
      } = req.body;

      const transaction =
        await Transaction.create({

          userId: req.user.id,

          title,
          amount,
          type,
          category,
          notes,
        });

      res.status(201).json({
        success: true,
        message:
          "Transaction added successfully",
        transaction,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };


// GET TRANSACTIONS
const getTransactions =
  async (req, res) => {

    try {

      const transactions =
        await Transaction.find({

          userId: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        transactions,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };


// UPDATE TRANSACTION
const updateTransaction =
  async (req, res) => {

    try {

      const transaction =
        await Transaction.findOne({

          _id: req.params.id,

          userId: req.user.id,
        });

      if (!transaction) {

        return res.status(404).json({
          message:
            "Transaction not found",
        });
      }

      const updatedTransaction =
        await Transaction.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Transaction updated successfully",
        updatedTransaction,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };


// DELETE TRANSACTION
const deleteTransaction =
  async (req, res) => {

    try {

      const transaction =
        await Transaction.findOne({

          _id: req.params.id,

          userId: req.user.id,
        });

      if (!transaction) {

        return res.status(404).json({
          message:
            "Transaction not found",
        });
      }

      await transaction.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Transaction deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };


// SUMMARY
const getSummary =
  async (req, res) => {

    try {

      const transactions =
        await Transaction.find({

          userId: req.user.id,
        });

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

      res.status(200).json({
        success: true,

        summary: {
          totalIncome,
          totalExpense,
          totalBalance,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };


module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
};