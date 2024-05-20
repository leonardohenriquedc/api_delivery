import { sql } from "../config/connection.js";

export class DataBase{

// Infos: nome, cpf, numerocelular, datanasc    
    async create(infos){
        let {nome, cpf, email, numerocelular, datanasc, hashtag, seguimento, senha, nivel} = infos
        try{
            await sql `INSERT INTO pessoas (nome, numerocelular, datanasc, senha, email) 
                        VALUES (${nome}, ${numerocelular}, ${datanasc}, ${senha}, ${email});`;

            await sql `INSERT INTO categSeg (hastag, keyCPF, seguimento) 
                        VALUES (ARRAY${hashtag}, ${cpf}, ARRAY${seguimento});`;
            await sql `INSERT INTOR niveis (keyCPF, nivel) VALUES (${cpf}, ${nivel});`;
            return true
        }catch (error){
            console.error('Deu ruim', error)
            return false
        }
    }

    async login(infos){
        if (infos.email == undefined){
            let {cpf, senha} = infos

            let result = await sql`SELECT * FROM pessoas WHERE cpf = ${cpf} and senha = ${senha}`
            if(result.length != [] && result.length != undefined && result.length != null){
                let username = await sql `SELECT nome FROM pessoas WHERE cpf = ${cpf} AND senha = ${senha}`
                return {status: 200, username: username}
            }else{
                return 404
            }
        }else{
            let {email, senha} = infos

            let result = await sql`SELECT * FROM pessoas WHERE email = ${email} AND senha = ${senha}`
            if(result.length != [] && result.length != undefined && result.length != null){
                return 200
            }else{
                return 404
            }
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
        let datas = await sql `SELECT * FROM pessoas, niveis, categSeg;`;
        if(datas.length != [] && datas.length != undefined && datas.length != null){
            return {status: 200, datas: datas}
        }else{
            return {status: 404}
        }
    }

    async delete(value){
        try {
            await sql `DELETE FROM niveis WHERE keyCPF = ${value};`;
            await sql `DELETE FROM pessoas WHERE cpf = ${value};`;
            await sql `DELETE FROM categSeg WHERE keyCPF = ${value};`;
            return {status: 200}
        }catch (error){
            return {status: 404, error: error}
        }
    }
} 