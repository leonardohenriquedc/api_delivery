import { sql } from "../config/connection.js";

export class DataBase{

// Infos: nome, cpf, numerocelular, datanasc    
    async create(infos){
        let {nome, email, cpf, numerocelular, datanasc, hashtag, seguimento} = infos
        try{
            await sql `INSERT INTO pessoas (nome, cpf, numerocelular, datanasc, email) 
                        VALUES (${nome}, ${cpf}, ${numerocelular}, ${datanasc}, ${email});`;

            await sql `INSERT INTO categSeg (hastag, keyCPF, seguimento) 
                        VALUES (${hashtag}, ${cpf}, ${seguimento});`;
            return true
        }catch (error){
            console.error('Deu ruim', error)
            return false
        }
    }
}