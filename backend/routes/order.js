import express from "express";
import {
  createOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controller/order.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// @path  /api/orders
router
  .route("/")
  .post(protect, createOrderItems)
  .get(protect, admin, getOrders);

router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
