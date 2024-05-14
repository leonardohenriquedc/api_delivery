import { info } from "console"
import { randomUUID } from "crypto"

export class DataBase{
    #pessoas = new Map()

    create(infos){
        let {email, senha, numeroTel} = infos
        const ID = randomUUID()
        Object.assign(infos, {'ID': ID})
        this.#pessoas.set(ID, infos)
        return this.#pessoas.get(ID)
    }

    update(infos){
        if(this.#pessoas.get(infos.ID)){
            this.#pessoas.set(infos.ID, infos)
            return this.#pessoas.get(ID)
        }else{
            return 400
        }
    }

}