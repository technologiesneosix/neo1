import { body, param, query } from 'express-validator';

export const sanitizeBody = (fields) => {
  const validations = fields.map((field) => body(field).trim().escape());
  return validations;
};

export const sanitizeParam = (fields) => {
  const validations = fields.map((field) => param(field).trim().escape());
  return validations;
};

export const sanitizeQuery = (fields) => {
  const validations = fields.map((field) => query(field).trim().escape());
  return validations;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
};
