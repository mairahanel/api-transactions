import { Request, Response, Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { UserController } from "../controllers/user.controller";
import { cpfExistsMiddleware } from "../middlewares/cpf-exists.middleware";
import { userExistsMiddleware } from "../middlewares/user-exists.middleware";

export const userRoutes = Router();

//Usuários 
userRoutes.post("/", [cpfExistsMiddleware], (req: Request, res: Response) => new UserController().create(req, res));

userRoutes.get("/:id", (req: Request, res: Response) => new UserController().getById(req, res));

userRoutes.get("/", (req: Request, res: Response) => new UserController().getAll(req, res));

userRoutes.delete("/:id", (req: Request, res: Response) => new UserController().delete(req, res));

userRoutes.put("/:id", (req: Request, res: Response) => new UserController().edit(req, res));


//Transactions
userRoutes.post("/:userId/transactions", [userExistsMiddleware], (req: Request, res: Response) => new TransactionController().create(req, res));

userRoutes.get("/:userId/transactions/:id", [userExistsMiddleware], (req: Request, res: Response) => new TransactionController().getById(req, res));

userRoutes.get("/:userId/transactions", [userExistsMiddleware], (req: Request, res: Response) => new TransactionController().getAllByUser(req, res));

userRoutes.delete("/:userId/transactions/:id", [userExistsMiddleware], (req: Request, res: Response) => new TransactionController().delete(req, res));

userRoutes.put("/:userId/transactions/:id", [userExistsMiddleware], (req:Request, res: Response) => new TransactionController().edit(req, res));
