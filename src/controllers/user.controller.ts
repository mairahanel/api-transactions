import { Request, Response } from "express";
import { usersList } from "../data/usersList";
import { User } from "../models/user";

export class UserController {

    public create(req: Request, res: Response) {
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
    };

    public getById(req: Request, res: Response) {
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
    };

    public getAll(req: Request, res: Response) {
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
    };

    public delete(req: Request, res: Response) {
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
    };

    public edit(req: Request, res: Response) {
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
    };
}