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


            return {status: 200, senha: data, somHash: hash}
        } catch (error) {
            return {status: 500, error: error}
        }
    }


    static vdlCreateColaborador(infos){
        let {infosTecnicas, endereco, infosPessoais} = infos

        let vdlInfosPessoais = new VdlInfos().vdlInfosPessoas(infosPessoais);

        let vdlInfosEndereco = new VdlInfos().vdlInfosEndereco(endereco);

        let vdlInfosTecnicas = new VdlInfos().vdlInfosTecnicas(infosTecnicas);

        if(vdlInfosPessoais && vdlInfosEndereco && vdlInfosTecnicas){

            return {status: 204};
        }else{
            
            return {status: 404};
        }
    }

    static vdlCreateCliente(infos){

    }

    static vdlIdeficador(infos){
        let {identificador, senha} = infos

        //Regex para validar se e um hash SHA-256, boolean Value
        //const hashTest = /^[a-f0-9]{64}$/.test(senha);

        // Expressão regular para validar se há somente numero e letras na string senha 
        const regexSenha = /^[\p{L}0-9\s]+$/u.test(senha);

        //Regex para validar se há somente numeros em uma string
        const RegexVdlNumber = /^\d+$/.test(identificador);

        // Expressão regular para validar e-mail
        const RegexVdlEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identificador);

        if(RegexVdlNumber && regexSenha && identificador.length === 11){
            console.log(RegexVdlNumber, "deu bom pelo visto")

            return {status: 200, type: "number"}
            
        }else if(RegexVdlEmail && regexSenha){
            
            return {status: 200, type: "email"}
        }else{
            console.log("Este e os resultados do regex")
            console.log("Teste hash " + hashTest + "Regex Numero:" + RegexVdlNumber);

            return {status: 404}
        }
    }
}

class VdlInfos {

    vdlInfosPessoas(infosPessoais){
        let {nome, cpf, numeroCelular, email, senha} = infosPessoais;

        //Regex para validar se ha algum caractere especial na string Nome 
        const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(nome);

        //Regex para validar se há somente numeros na string CPF
        const regexCpf = /^\d+$/.test(cpf);

        //Regex para validar se há somente numeros na String numeroCelular
        const regexNumeroCelular = /^\d+$/.test(numeroCelular);
        
        // Expressão regular para validar e-mail
        const regexVdlEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        // Expressão regular para validar se há somente numero e letras na string senha 
        const regexSenha = /^[\p{L}0-9\s]+$/u.test(senha);

        if(regexNome && regexCpf && regexNumeroCelular && regexVdlEmail && regexSenha && numeroCelular.length === 11 && cpf.length === 11){
    
            return true; 
        }else{
            console.log("Deu ruim nas infos Pessoais: ");

            console.log(regexNome + regexCpf + regexNumeroCelular + regexVdlEmail + numeroCelular.length + cpf.length);

            return false;
        }
    }

    vdlInfosEndereco(infosEndereco){
        const {ruaAv, numeroCasa, bairro, BlocoQuadraLote, cep} = infosEndereco;

        const vdlCep = /^\d+$/.test(cep);
        
        const bql = BlocoQuadraLote;
        //Regex para validar se ha algum caractere especial na string Nome 
        const regexRuaAv = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(ruaAv);

        //Regex para validar se há somente numeros na String numeroCasa
        const regexNumeroCasa = /^\d+$/.test(numeroCasa);

        // Regex para validar se há somente numero e letras na string bairro
        const regexBairro = /^[\p{L}0-9\s]+$/u.test(bairro);

        const vdlBlocoQuadraLote = (bql) => {
            // Regex para validar se há somente numero e letras no objeto BlocoQuadraLote
            const regexBQL = /^[a-zA-Z0-9]+$/;

            if(!bql){
                return false;
            }

            const {Bloco, Quadra, Lote} = bql;

            if(!Bloco || !Quadra || !Lote ){
                return false;
            }

            if( regexBQL.test(Bloco) && regexBQL.test(Quadra) && regexBQL.test(Lote)){

                return true;
            }else{

                return false;
            }

        }

        if([ruaAv, numeroCasa, bairro, BlocoQuadraLote, cep].some(value => value === undefined)){
            console.log("Algum valor esta indefinido")
            
            return false;
        }

        if(regexRuaAv && regexNumeroCasa && regexBairro && vdlBlocoQuadraLote(bql) && vdlCep){
                
            return true;
        }else{
            console.log("Deu ruim aqui no endereço: ");

            console.log("1: " + regexRuaAv + "2: " + regexNumeroCasa + "3: " + regexBairro + "4: " + vdlBlocoQuadraLote(bql));

            return false;
        }
    }

    vdlInfosTecnicas(infosTecnicas){
        let { nivel } = infosTecnicas;

        //Regex para validar se há somente numeros na String id_cargoFuncao
        const regexCargoFuncao = /^\d+$/.test(nivel.id_cargoFuncao);

        if(regexCargoFuncao){

            return true;
        }else{
            console.log("Deu ruim aqui nas infos Tecnicas: ");

            console.log(regexCargoFuncao);

            return false;
        }
    }
}