import { usersList } from "../data/usersList"

export class UserController {
    public getByCpf(cpf: number) {
        (usersList.some(user => user.cpf === cpf))
    }
}