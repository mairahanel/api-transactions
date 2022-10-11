import { Request, Response } from "express";
import { usersList } from "../data/usersList";
import { Transaction } from "../models/transaction";

export class TransactionController {

    public create(req: Request, res: Response) {
        try {
            const { title, value, type } = req.body;
            const { userId } = req.params;
    
            if(!title) {
                return res.status(400).send({
                    ok: false,
                    message: "Title not provided"
                })
            };
    
            if(!value) {
                return res.status(400).send({
                    ok: false,
                    message: "Value not provided"
                })
            };
    
            if(!type) {
                return res.status(400).send({
                    ok: false,
                    message: "Type not provided"
                })
            };
    
            if(type !== "income" && type !== "outcome") {
                return res.status(400).send({
                    ok: false,
                    message: "Type value is not valid (must be income or outcome)"
                })
            };
    
            const transaction = new Transaction(title, value, type);
    
            let userTransaction = usersList.find((item) => item.id === userId);
    
            userTransaction?.transactions.push(transaction);
    
            return res.status(201).send({
                ok: true,
                message: "Transaction succesfully created",
                data: usersList
            })
    
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: "Erro no servidor",
                error: error.toString(),
            })
        }
    };

    public getById(req: Request, res: Response) {
        try {
            const { userId, id } = req.params;
    
            let user = usersList.find((user) => user.id === userId);
    
            let transaction = user?.transactions.find((transaction) => transaction.id === id);
    
            if(!transaction) {
                return res.status(404).send({
                    ok: false,
                    message: "Transaction not found"
                })
            }
    
            return res.status(200).send(transaction);
    
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: "Erro no servidor",
                error: error.toString(),
            })
        }
    };

    public getAllByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { title, type } = req.query;
    
            let user = usersList.find((user) => user.id === userId);
    
            let somaIncomes = 0;
            let somaOutcomes = 0;
    
    
            user?.transactions.forEach((transaction) => {
                if(transaction.type === "income") {
                    somaIncomes = somaIncomes + transaction.value;
                };
    
                if(transaction.type === "outcome") {
                    somaOutcomes = somaOutcomes + transaction.value;
                };
            })
    
            let totalCredito = somaIncomes - somaOutcomes;
    
    
            if(!title && !type) {
                return res.status(200).send({
                    transactions: [user?.transactions],
                    balance: {
                        incomes: somaIncomes,
                        outcomes: somaOutcomes,
                        credito: totalCredito
                    }
                });
            };
    
            let transactionTitle = user?.transactions.filter((transaction) => transaction.title === title);
            let transactionType = user?.transactions.filter((transaction) => transaction.type === type);
    
            if(!transactionTitle && !transactionType) {
                return res.status(404).send({
                    ok: false,
                    message: "Transaction not found"
                })
            }; 
    
            if(title) {
                return res.status(200).send({
                    transactions: [transactionTitle]
                })
            };
    
            if(type) {
                return res.status(200).send({
                    transactions: [transactionType]
                })
            };
    
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: "Erro no servidor",
                error: error.toString(),
            })
        }
    };

    public delete(req: Request, res: Response) {
        try {
            const { userId, id } = req.params;
    
            let user = usersList.find((user) => user.id === userId);
    
            if(!user) {
                return undefined
            };
    
            let transactionIndex = user.transactions.findIndex((transaction) => transaction.id === id);
    
            if(transactionIndex < 0) {
                return res.status(404).send({
                    ok: false,
                    message: "Transaction not found"
                })
            };
    
            user.transactions.splice(transactionIndex, 1);
    
            return res.status(200).send({
                ok: true,
                message: "Transaction succesfully deleted",
                data: user.transactions
            });
    
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: "Erro no servidor",
                error: error.toString(),
            })
        }
    };

    public edit(req: Request, res: Response) {
        try {
            const { userId, id } = req.params;
            const { title, value, type } = req.body;
    
            let user = usersList.find((user) => user.id === userId);
    
            let transaction = user?.transactions.find((transaction) => transaction.id === id);
    
            if(!transaction) {
                return res.status(404).send({
                    ok: false,
                    message: "Transaction not found"
                })
            };
    
            if(!title) {
                return res.status(400).send({
                    ok: false,
                    message: "Title not provided"
                })
            };
    
            if(!type) {
                return res.status(400).send({
                    ok: false,
                    message: "Type not provided"
                })
            };
    
            if(!value) {
                return res.status(400).send({
                    ok: false,
                    message: "Value not provided"
                })
            };
    
            transaction.title = title;
            transaction.type = type;
            transaction.value = value;
    
            return res.status(201).send({
                ok: true,
                message: "Transaction succesfully edited",
                data: user?.transactions
            });
    
        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: "Erro no servidor",
                error: error.toString(),
            })
        }
    };

}