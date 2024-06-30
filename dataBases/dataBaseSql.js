import { sql } from "../config/connection.js";
import { Vdl } from "../validations/validationsInfos.js";

export class DataBase{

// Infos: nome, cpf, numerocelular, datanasc    
    async create(infos){
        let {nome, cpf, email, numerocelular, datanasc, senha, nivel} = infos
        console.log(infos)
        let hashPW = await Vdl.createHash2({senha: senha});
        if(hashPW.status === 200){
            try{
                await sql `INSERT INTO pessoas (nome, cpf, email, numerocelular, datanasc, senha) 
                            VALUES (${nome}, ${cpf}, ${email}, ${numerocelular}, ${datanasc}, ${hashPW.senha});`;
                await sql `INSERT INTO niveis (keyCPF, nivel) VALUES (${cpf}, ${nivel});`;
                return {status: 200}
            }catch (error){
                return {status: 404, error: error}
            } 
        }else{
            return {status: 500, error: hashPW.error}
        }
    }

    async login(infos, type){
        let result;
     
        if(type === "number"){
            let {identificador} = infos;

            try {

                result = await sql`SELECT * FROM pessoas WHERE numerocelular = ${identificador};`;

            } catch (error) {
             
                console.log(error);
            }

        }else{
            let{identificador} = infos;

            try {

                result = await sql`SELECT * FROM pessoas WHERE email = ${identificador};`;

            } catch (error) {

                console.log(error);
            }
    
        }
        
        if(result.length != [] && result.length != undefined && result.length != null){
            let {senha} = infos;

            let hSenha = result[0].senha;

            let hashSaltSenha = await Vdl.removeSalt(hSenha);
            
            if(hashSaltSenha === senha){
                let objUser = result[0];
                
                let user = {
                    nome: objUser.nome,
                    email: objUser.email,
                    id: objUser.id
                }

                return {status: 200, user: user}
                
            }else{
                
                return {status: 401}
            }
            
        }else{

            return {status: 404}
        }
    }

    async update(type, body){
        let newValue = body.newValue;
        let validation = body.validation;
        switch(type){
            case 'e':
                try {
                    await sql `UPDATE pessoas SET email  = ${newValue} WHERE senha = ${validation};`;
                    return 204
                } catch (error) {
                    return error
                }
                break

            case 's':
                try {
                    await sql `UPDATE pessoas SET senha  = ${newValue} WHERE email = ${validation};`;
                    return 204
                } catch (error) {
                    return error
                }
                break

            case 'nm': 
                try {
                    await sql `UPDATE pessoas SET nome  = ${newValue} WHERE senha = ${validation};`;
                    return 204
                } catch (error) {
                    return error
                }
                break

            case 'nr':
                try {
                    await sql `UPDATE pessoas SET numerocelular  = ${newValue} WHERE senha = ${validation};`;
                    return 204
                } catch (error) {
                    return error
                }
                break
        }
    }

    async cadView(){
        let datas = await sql `SELECT DISTINCT * FROM pessoas JOIN categSeg ON pessoas.cpf = categSeg.keycpf JOIN niveis ON pessoas.cpf = niveis.keycpf;`;
        if(datas.length != [] && datas.length != undefined && datas.length != null){
            return {status: 200, datas: datas}
        }else{
            return {status: 404}
        }
    }

    async delete(value){
        try {
            await sql `DELETE FROM niveis WHERE keyCPF = ${value};`;
            await sql `DELETE FROM categSeg WHERE keyCPF = ${value};`;
            await sql `DELETE FROM pessoas WHERE cpf = ${value};`;
            return {status: 200}
        }catch (error){
            return {status: 404, error: error}
        }
    }
}