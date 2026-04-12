import { mySqlPool } from "../config/index.js";
import { BadRequestError, NotFoundError, successResponse } from "../shared/index.js";

const queries = {
  getAllEmployees: "SELECT * FROM employees",
  getEmployeeById: "SELECT * FROM employees WHERE employee_id = ?",
  createNewEmployee:
    "INSERT INTO employees (first_name, last_name, job_title, salary, reports_to, office_id) VALUES (?, ?, ?, ?, ?, ?)",
  updateEmployeeById:
    "UPDATE employees SET first_name = ?, last_name = ?, job_title = ?, salary = ?, reports_to = ?, office_id = ? WHERE employee_id = ?",
  deleteEmployeeById: "DELETE FROM employees WHERE employee_id = ?",
};

export class EmployeeController {
  async getAllEmployees(req, res, next) {
    try {
      const [data] = await mySqlPool.execute(queries.getAllEmployees);
      if (data.length === 0) throw new NotFoundError("No employees found in the database");
      return successResponse(req, res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const [data] = await mySqlPool.execute(queries.getEmployeeById, [id]);
      if (data.length === 0) {
        throw new NotFoundError("No employee found with the given employee id");
      }
      return successResponse(req, res, data, 200);
    } catch (err) {
      next(err);
    }
  }

  async createEmployee(req, res) {
    try {
      const { first_name, last_name, job_title, salary, reports_to, office_id } = req.body;
      const [data] = await mySqlPool.execute(queries.createNewEmployee, [
        first_name,
        last_name,
        job_title,
        salary,
        reports_to,
        office_id,
      ]);
      if (data.affectedRows === 0) {
        throw new BadRequestError("Failed to create a new employee with the provided data");
      }
      return successResponse(req, res, null, 201);
    } catch (err) {
      next(err);
    }
  }

  async updateEmployee(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { first_name, last_name, job_title, salary, reports_to, office_id } = req.body;
      const [data] = await mySqlPool.execute(queries.updateEmployeeById, [
        first_name,
        last_name,
        job_title,
        salary,
        reports_to,
        office_id,
        id,
      ]);
      if (data.affectedRows === 0) {
        throw new NotFoundError("No employee found with the given employee id");
      } else {
        return successResponse(req, res, null, 200);
      }
    } catch (err) {
      next(err);
    }
  }

  async deleteEmployee(req, res) {
    try {
      const id = parseInt(req.params.id);
      const [data] = await mySqlPool.execute(queries.deleteEmployeeById, [id]);
      if (data.affectedRows === 0) {
        throw new NotFoundError("No employee found with the given employee id");
      } else {
        return successResponse(req, res, null, 200);
      }
    } catch (err) {
      next(err);
    }
  }
}
