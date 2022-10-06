import { Request, Response, NextFunction } from 'express';
import { usersList } from '../data/usersList';

export const cpfExistsMiddleware = (req: Request, res: Response, next: NextFunction) => {
     
    const { cpf } = req.body;

    if(usersList.some(user => user.cpf === cpf)){
        return res.status(400).send({
            ok: false,
            message: "CPF already registred on the system"
        })
    };

    next();
}