import { Router } from "express";
import { EmployeeController } from "../controllers/index.js";

const employeeRouter = Router();

const employeeController = new EmployeeController();

// Define routes for employee-related operations
employeeRouter.get("/", employeeController.getAllEmployees);
employeeRouter.get("/:employee_id", employeeController.getEmployeeById);

export default employeeRouter;
