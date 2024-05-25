import { sql } from "../config/connection.js";
import crytpo from 'crypto';

export class vdlsInfos{

    static async hashCreate(values){
        const regex = /^.{32}/
        const senhaSemSalt = values.replace(regex, '');
        
        return await senhaSemSalt
    }

    static async createHash2(infos){
        try {
            let hash = crytpo.createHash('sha256').update(infos.senha).digest('hex');
            let salt = crytpo.randomBytes(16).toString('hex')
            let data = salt + hash;

            return {status: 200, senha: data}
        } catch (error) {
            return {status: 500, error: error}
        }
    }
}