import { RequestHandler } from "express";
import { isDate, isDecimal, isUUID } from "validator";
import Investment from "../models/Investment";

// GET REQUESTS
// GET ALL INVESTMENTS
const getInvestments: RequestHandler = async (req, res, next) => {
  try {
    const investments: Investment[] = await Investment.getInvestments();
    return res.status(200).json(investments);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// GET INVESTMENT BY ID
const getInvestmentById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isUUID(id)) {
      res.status(400);
      return next(new Error("Invalid investment id"));
    }

    const investment = await Investment.getInvestment(id);
    return res.status(200).json(investment);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// GET STATISTICS
const getInvestmentsStatistics: RequestHandler = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy, includeUnconfirmed } = req.query;

    if (!startDate || !endDate || !groupBy || !includeUnconfirmed) {
      res.status(400);
      return next(new Error("Required fields are missing"));
    }

    // avoid typescript error
    if (
      typeof startDate !== "string" ||
      typeof endDate !== "string" ||
      typeof groupBy !== "string" ||
      typeof includeUnconfirmed !== "string"
    ) {
      res.status(400);
      return next(new Error("Invalid date format"));
    }

    // validate dates
    if (!isDate(startDate) || !isDate(endDate)) {
      res.status(400);
      return next(new Error("Invalid date format"));
    }
    if (startDate > endDate) {
      res.status(400);
      return next(new Error("Start date can't be after end date"));
    }

    // validate groupBy option
    const groupByOptions = ["day", "week", "month", "year"];
    if (!groupByOptions.includes(groupBy)) {
      res.status(400);
      return next(
        new Error(
          `Invalid groupBy value. Allowed values are: ${groupByOptions.join(
            ", "
          )}`
        )
      );
    }

    // true if includeUnconfirmed is a string like"true", false everything else
    const includeUnconfirmedInvestments = includeUnconfirmed === "true";

    // convert in date format
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    const statistics = await Investment.getInvestmentsStatistics(
      sDate,
      eDate,
      groupBy,
      includeUnconfirmedInvestments
    );

    console.log(statistics);

    return res.status(200).json(statistics);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// POST REQUEST - CREATE INVESTMENT
const createInvestment: RequestHandler = async (req, res, next) => {
  try {
    const { confirmDate, value, annualRate } = req.body;

    if (!value || !annualRate) {
      res.status(400);
      return next(new Error("Missing required fields"));
    }

    if (!isDecimal(String(value)) || !isDecimal(String(annualRate))) {
      res.status(400);
      return next(new Error("Value and annual rate must be decimal numbers"));
    }

    if (value <= 0 || annualRate <= 0) {
      res.status(400);
      return next(new Error("Value and annual rate must be positive numbers"));
    }

    if (confirmDate && confirmDate < new Date()) {
      res.status(400);
      return next(new Error("Confirm date can't be in the past"));
    }

    const newInvestment = {
      confirmDate,
      value,
      annualRate,
    };

    // create new investment
    const createdInvestment = await Investment.createInvestment(newInvestment);
    return res.status(201).json(createdInvestment);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// PATCH REQUEST - CONFIRM INVESTMENT
const confirmInvestment: RequestHandler = async (req, res, next) => {
  try {
    const { id, confirmDate } = req.body;

    // validate uuid
    if (!isUUID(id)) {
      res.status(400);
      return next(new Error("Invalid investment id"));
    }

    // validate date
    if (!confirmDate || !isDate(confirmDate)) {
      res.status(400);
      return next(new Error("Invalid or missing confirm date"));
    }

    const confirmedInvestment = await Investment.confirmInvestment(
      id,
      confirmDate
    );
    return res.status(200).json(confirmedInvestment);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

export {
  getInvestments,
  createInvestment,
  getInvestmentById,
  confirmInvestment,
  getInvestmentsStatistics,
};
