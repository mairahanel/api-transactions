import { NextFunction, Request, Response } from "express";
import { usersList } from "../data/usersList";

export const userExistsMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const { userId } = req.params;

    let user = usersList.find((user) => user.id === userId);

    if(!user) {
        return res.status(404).send({
            ok: false,
            message: "User not found"
        })
    }

    next();
}