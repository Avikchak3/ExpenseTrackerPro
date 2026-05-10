const express = require("express");

const router = express.Router();

const transactionController =
  require("../controllers/transactionController");

const protect =
  require("../middleware/authMiddleware");


// ADD TRANSACTION
router.post(
  "/",
  protect,
  transactionController.addTransaction
);


// GET TRANSACTIONS
router.get(
  "/",
  protect,
  transactionController.getTransactions
);


// UPDATE TRANSACTION
router.put(
  "/:id",
  protect,
  transactionController.updateTransaction
);


// DELETE TRANSACTION
router.delete(
  "/:id",
  protect,
  transactionController.deleteTransaction
);


module.exports = router;