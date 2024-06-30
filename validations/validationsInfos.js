import { sql } from "../config/connection.js";
import crytpo from 'crypto';

export class Vdl{
    // Regex usado para extrair o salt e validar somente o hash em si. 
    static async removeSalt(values){
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

    static vdlCreate(infos){
        let {email, cpf, numerocelular, datanasc, hashtag, categoria} = infos;

        //validação: CPF, numerocelular, datanasc, hastag e seguimento
        // cpf = 11
        let LCpf = cpf.length

        // numerocelular = 13
        let LNC = numerocelular.length;

        // datanasc = "YYYY-MM-DD"
        let LDnasc = () => {
            // Primeiro, verifique o formato da data usando uma expressão regular
            const regex = /^\d{4}-\d{2}-\d{2}$/;

            if (!regex.test(datanasc)) {
                return false;
            }
        
            // Em seguida, verifique se a data é válida
            const [year, month, day] = datanasc.split('-').map(Number);
            const date = new Date(year, month - 1, day);
        
            if (date.getFullYear() !== year || date.getMonth() !== (month - 1) || date.getDate() !== day) {
                return false;
            }
        
            return true;
        }
        // Expressão regular para validar e-mail
        let Leml = () => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        if (LCpf !== 11 || LNC !== 13 || !LDnasc() || !Leml) {
            return 404;
        } else {
            return true;
        }
    }

    static vdlIdeficador(infos){
        let {identificador, senha} = infos

        //Regex para validar se e um hash SHA-256, boolean Value
        const hashTest = /^[a-f0-9]{64}$/.test(senha);

        //Regex para validar se há somente numeros em uma string
        const RegexVdlNumber = /^\d+$/.test(identificador);

        // Expressão regular para validar e-mail
        const RegexVdlEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador);

        if(RegexVdlNumber && hashTest && identificador.length === 13){
            console.log(RegexVdlNumber, "deu bom pelo visto")

            return {status: 200, type: "number"}
            
        }else if(RegexVdlEmail && hashTest){  
            
            return {status: 200, type: "email"}
        }else{
                
            return {status: 404}
        }
    }
}