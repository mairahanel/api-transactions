import { Request, Response, Router } from "express";
import { usersList } from "../data/usersList";
import { cpfExistsMiddleware } from "../middlewares/cpf-exists.middleware";
import { userExistsMiddleware } from "../middlewares/user-exists.middleware";
import { Transaction } from "../models/transaction";
import { User } from "../models/user";

export const userRoutes = Router();

//Usuários 
userRoutes.post("/", [cpfExistsMiddleware], (req: Request, res: Response) => {

    try {
        const { name, cpf, email, age } = req.body;

        if(!name) {
            return res.status(400).send({
                ok: false,
                message: "Name not provided"
            });
        };
    
        if(!cpf) {
            return res.status(400).send({
                ok: false,
                message: "CPF not provided"
            });
        };

        if(!email) {
            return res.status(400).send({
                ok: false,
                message: "Email not provided"
            });
        };

        if(!age) {
            return res.status(400).send({
                ok: false,
                message: "Age not provided"
            });
        };

        //Criar uma instância da classe User
        const user = new User(name, cpf, email, age);

        //Adicionar o array de usuários
        usersList.push(user);

        return res.status(201).send({
            ok: true,
            message: "User succesfully registred",
            data: usersList
        })

    } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: error.toString()
        })
    }

});

userRoutes.get("/:id", (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        let user = usersList.find((item) => item.id === id);

        if(!user){
            return res.status(404).send({
                ok: false,
                message: "User not found"
            })
        }else{
            return res.status(200).send({
                id: user.id,
                name: user.name,
                cpf: user.cpf,
                email: user.email,
                age: user.age
            });
        }

    } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: "Erro no servidor",
            error: error.toString(),
        })
    }
});

userRoutes.get("/", (req: Request, res: Response) => {

    try {
        const { name, email, cpf } = req.query;

        let resultName = usersList.find((user) => user.name === name);
        let resultEmail = usersList.find((user) => user.email === email);
        let resultCpf = usersList.find((user) => user.cpf === Number(cpf));


        if(usersList.length == 0) {
            return res.status(200).send({
                ok: true,
                message: "Não há usuários cadastrados."
            });
        };

        if(!name && !email && !cpf) {
            return res.status(200).send({
                ok: true,
                message: "Users succesfully listed.",
                data: usersList
            });
        };

        if(!resultName && !resultEmail && !resultCpf ){
            return res.status(404).send({
                ok:false,
                message: "User not found"
            })
        }
        
        if(resultName){
            return res.status(200).send({
                id: resultName.id,
                name: resultName.name,
                cpf: resultName.cpf,
                email: resultName.email,
                age: resultName.age
            });
        }

        if(resultEmail){
            return res.status(200).send({
                id: resultEmail.id,
                name: resultEmail.name,
                cpf: resultEmail.cpf,
                email: resultEmail.email,
                age: resultEmail.age
            });
        }

        if(resultCpf){
            return res.status(200).send({
                id: resultCpf.id,
                name: resultCpf.name,
                cpf: resultCpf.cpf,
                email: resultCpf.email,
                age: resultCpf.age
            });
        }

    } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: "Erro no servidor",
            error: error.toString(),
        })
    }
    
});

userRoutes.delete("/:id", (req: Request, res: Response) => {

    try {
        const { id } = req.params;

    let userIndex = usersList.findIndex((item) => item.id === id);

    if(userIndex < 0) {
        return res.status(404).send({
            ok: false,
            message: "User not found"
        })
    };

    usersList.splice(userIndex, 1);

    return res.status(200).send({
        ok: true,
        message: "User succesfully deleted",
        data: usersList
    });

    } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: "Erro no servidor",
            error: error.toString(),
        })
    }
    
});

userRoutes.put("/:id", (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;

        let user = usersList.find((item) => item.id === id);

        if(!user) {
            return res.status(404).send({
                ok: false,
                message: "User not found"
            })
        }

        user.name = name;
        user.email = email;
        user.age = age;


        if(!name) {
            return res.status(400).send({
                ok: false,
                message: "Name not provided"
            })
        };

        if(!age) {
            return res.status(400).send({
                ok: false,
                message: "Age not provided"
            })
        };

        if(!email) {
            return res.status(400).send({
                ok: false,
                message: "Email not provided"
            })
        };

        return res.status(201).send({
            ok: true,
            message: "User succesfully updated",
            data: usersList
        });

    } catch (error: any) {
        return res.status(500).send({
            ok: false,
            message: "Erro no servidor",
            error: error.toString(),
        })
    }
});


//Transactions
userRoutes.post("/:userId/transactions", [userExistsMiddleware], (req: Request, res: Response) => {
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
});

userRoutes.get("/:userId/transactions/:id", [userExistsMiddleware], (req: Request, res: Response) => {
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
});

userRoutes.get("/:userId/transactions", (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { title, type } = req.query;

        let user = usersList.find((user) => user.id === userId);

        if(!user) {
            return res.status(404).send({
                ok: false,
                message: "User not found"
            })
        };

        let somaIncomes = 0;
        let somaOutcomes = 0;

        for(let transaction of user.transactions) {

            if(transaction.type === "income") {
                somaIncomes = somaIncomes + transaction.value;
            };

            if(transaction.type === "outcome") {
                somaOutcomes = somaOutcomes + transaction.value;
            };
        };

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

        let transactionTitle = user.transactions.filter((transaction) => transaction.title === title);
        let transactionType = user.transactions.filter((transaction) => transaction.type === type);

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
});

userRoutes.delete("/:userId/transactions/:id", (req: Request, res: Response) => {
    try {
        const { userId, id } = req.params;

        let user = usersList.find((user) => user.id === userId);

        if(!user) {
            return res.status(404).send({
                ok: false,
                message: "User not found"
            })
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
});

userRoutes.put("/:userId/transactions/:id", [userExistsMiddleware], (req:Request, res: Response) => {
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
});
