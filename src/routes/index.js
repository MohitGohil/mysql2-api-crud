import { Router } from "express";
import { EmployeeController } from "../controllers/index.js";

const employeeRouter = Router();

const employeeController = new EmployeeController();

// Define routes for employee-related operations
employeeRouter.get("/", employeeController.getAllEmployees);
employeeRouter.get("/:id", employeeController.getEmployeeById);
employeeRouter.post("/", employeeController.createEmployee);
employeeRouter.put("/:id", employeeController.updateEmployee);
employeeRouter.delete("/:id", employeeController.deleteEmployee);

export default employeeRouter;
