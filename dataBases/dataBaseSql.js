import { sql } from "../config/connection.js";
import { Vdl } from "../validations/validationsInfos.js";
import { DataHora } from "./getDate.js";

export class DataBase{

    async functionsCreate(){
        try {
            
            let cargofuncao = await sql`SELECT * FROM del_setor`;

            if(cargofuncao.length != [] && cargofuncao.length != undefined && cargofuncao.length != null){

                return {
                    status: 200, 
                    cargofuncao: cargofuncao
                }
            }else{

                return {
                    status: 404 
                }
            }
        } catch (error) {
            console.log(error)

            return {
                status: 500,
                error: error
            }
        }
    }
      
    async create(infos, type){
        if(type == 'col'){
            const {infosTecnicas, endereco, infosPessoais} = infos;

            const {nome, cpf, numeroCelular, email, senha} = infosPessoais;

            const { nivel } = infosTecnicas;

            const { ruaAv, numeroCasa, bairro, BlocoQuadraLote, cep } = endereco;

            const data = new DataHora().capturandoData();

            try {
                
                const vdlUniqueData = await sql `SELECT * FROM del_funcionario WHERE cpf = ${cpf}`;
                console.log("Este e o valor enviado: " + vdlUniqueData)
                if(vdlUniqueData.length === 0){

                    const insertInfoPessoais = await sql `INSERT INTO del_funcionario(
                        nome_completo, 
                        cpf, 
                        numero_celular, 
                        senha, 
                        data_cadastro,
                        email
                    )
                    VALUES (
                        ${nome}, 
                        ${cpf}, 
                        ${numeroCelular}, 
                        ${senha}, 
                        ${data},
                        ${email}
                    )
                    RETURNING id_funcionario`;
    
                    const idPessoa = insertInfoPessoais[0].id_funcionario;
                
                    console.log(idPessoa);
    
                    const consultCadPessoa = await sql `SELECT * FROM del_funcionario WHERE id_funcionario = ${idPessoa};`;

                    if(consultCadPessoa[0].cpf === cpf){

                        await sql `INSERT INTO del_endereco(
                                rua, 
                                numero, 
                                bairro, 
                                bloco_quadra_lote, 
                                cep, 
                                id_funcionario
                            )
                            VALUES(
                                ${ruaAv},
                                ${numeroCasa},
                                ${bairro},
                                ${BlocoQuadraLote},
                                ${cep},
                                ${idPessoa}
                            )`;

                        return {
                            status: 204
                        }
                    }else{

                        return {
                            status: 404, 
                            error: "Erro ao encontrar usuario"
                        }
                    }
                }else{

                    return {
                        status: 404, 
                        error: "Cadastro ja existe"
                    }
                }
            
            } catch (error) {

                console.log("Deu ruim paizao, catch: " + error)

                return {
                    status: 500, 
                    error: error
                }
            }

        }
    }

    async login(infos, type){
        let result;
     
        if(type === "number"){
            let {identificador} = infos;

            try {

                result = await sql`SELECT * FROM del_funcionario WHERE numero_celular = ${identificador};`;

                console.log(result)

            } catch (error) {
             
                console.log(error);
            }

        }else{
            let{identificador} = infos;

            try {

                result = await sql`SELECT * FROM del_funcionario WHERE email = ${identificador};`;
            } catch (error) {

                console.log(error);
            }
    
        }
        
        if(result.length != [] && result.length != undefined && result.length != null){
            let {senha} = infos;

            let hSenha = result[0].senha;

            //let hashSaltSenha = await Vdl.removeSalt(hSenha);
            
            if(hSenha === senha){
                let objUser = result[0];
                
                let user = {
                    nome: objUser.nome_completo,
                    email: objUser.email,
                    id: objUser.id_funcionario
                }

                return {
                    status: 200, 
                    user: user
                }
                
            }else{
                
                return {
                    status: 401
                }
            }
            
        }else{

            return {
                status: 404
            }
        }
    }

    async update(type, oldIdentifier, newIdentifier, senha){
        
        if(type == "email"){

            try{
                const resultSearchOne = await sql `
                    UPDATE del_funcionario 
                    SET email = ${newIdentifier} 
                    WHERE email = ${oldIdentifier} 
                    AND senha = ${senha}
                `;

                if(resultSearchOne.rowCount == 1){

                    return true;

                }else{

                    return false;

                }

            }catch(error){

                console.log(error);

                return false;
            }

            
        }else if(type == "number"){

            try {
                
                const resultSearchOne = await sql `
                    UPDATE del_funcionario
                    SET numero_celular = ${newIdentifier}
                    WHERE numero_celular = ${oldIdentifier}
                    AND senha = ${senha}
                `;

                if(resultSearchOne.rowCount == 1){

                    return true;

                }else{

                    return false;

                }

            } catch (error) {
                console.log(error);

                return false;

            }
        }
        
    }

    async delete(value){
        try {
            await sql `DELETE FROM niveis WHERE keyCPF = ${value};`;

            await sql `DELETE FROM categSeg WHERE keyCPF = ${value};`;

            await sql `DELETE FROM pessoas WHERE cpf = ${value};`;

            return {
                status: 200
            }
        }catch (error){

            return {
                status: 404,
                error: error
            }
        }
    }
}