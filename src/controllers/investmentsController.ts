import { RequestHandler } from "express";
import Investment from "../models/Investment";

const getInvestments: RequestHandler = async (req, res, next) => {
  try {
    const investments: Investment[] = await Investment.getInvestments();
    return res.status(200).json(investments);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const getInvestmentById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // TODO - Validation
    console.log(id);

    const investment = await Investment.getInvestment(id);
    return res.status(200).json(investment);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

const createInvestment: RequestHandler = async (req, res, next) => {
  try {
    const { confirmDate, value, annualRate } = req.body;

    if (!value || !annualRate) {
      res.status(400);
      return next(new Error("Missing required fields"));
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

export { getInvestments, createInvestment, getInvestmentById };
