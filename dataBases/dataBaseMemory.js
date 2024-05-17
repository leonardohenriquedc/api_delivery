import { randomUUID } from "crypto"
export class DataBase{
    // a chave para as infos sera o CPF
    #pessoas = new Map()

    create(infos){
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

    cadView(id){
        return this.#pessoas.get(id)
    }

    delete(id){
        this.#pessoas.delete(id)
        return 200
    }

    login(infos){
        
    }
}