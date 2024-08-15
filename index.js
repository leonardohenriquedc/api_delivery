import fastify from "fastify";
import fastifyJwt from "fastify-jwt";
import { DataBase } from "./dataBases/dataBaseSql.js";
import dotenv from "dotenv";
import { Vdl } from "./validations/validationsInfos.js";

dotenv.config()

let dataBase = new DataBase();

let server = fastify({logger: true});

server.register(fastifyJwt, {
    secret: process.env.SECRET_KEY,
    sign: {
        expiresIn: '10m'
    }
})

async function validationJwt(token){
    try {

        const vdlToken = server.jwt.verify(token);

        if(vdlToken.id_funcionario !== undefined){

            let newToken = server.jwt.sign({vdlToken})
            
            return {
                status: 200, 
                token: newToken
            }

        }else{

            return {
                status: 401
            }
        }
    } catch (error) {

        return {
            status: 401, 
            error: error
        }
    }
}
  
//Esta rota inicia a conexão com a API e envia informações para cadastro e login. 
server.get("/", async (request, response) => {
    let funcoesLoginAndCreate = await dataBase.functionsCreate();

    if(funcoesLoginAndCreate.status === 200){

        response.status(200).send(funcoesLoginAndCreate.cargofuncao);
    }else if(funcoesLoginAndCreate.status === 404){

        response.status(404).send();
    }else{
        
        response.status(500).send();
    }
})

//Create CRUD, type == col é colaborador e, type == cli é cliente.
server.post('/create/:type', async(request, response) => {
    let typeCreate = request.params.type;

    server.log.info(`Este e o paramento enviado: ${typeCreate}`);

    let vdlCreate;

    let createCad;

    if(typeCreate === 'col'){

        vdlCreate = Vdl.vdlCreateColaborador(request.body);

        if(vdlCreate){

            createCad = await dataBase.create(request.body, "col");

            if(createCad.status == 204){

                response.status(204).send();
            }else{

                response.status(404).send(createCad.error);
            }
        }else{

            response.status(404).send("Não passou pela validação");
        }

    }else if(typeCreate === 'cli'){

        vdlCreate = Vdl.vdlCreateCliente(request.body);
    }else{

        response.status(404).send("Paramento invalido: " + typeCreate);
    }
})

//
server.post('/login', async (request, response) => {
    let vdlInfos  = Vdl.vdlIdeficador(request.body)

    if(vdlInfos.status == 200){
        let resL = await dataBase.login(request.body, vdlInfos.type);

        if(resL.status == 200){ 

        const user = resL.user;
        console.log(user)

        try{
            
            const token = server.jwt.sign({
                nome: user.nome,
                email: user.email,
                id: user.id
            });

            response.status(200).send({token});

        }catch (error){
            console.log('Deu ruim', error);

            response.status(404).send();
        }
        }else if(vdlInfos.status == 401){

            response.status(401).send('Senha ou identificador incorretos');
        }else{

            response.status(404).send("Usuario não encontrado");
        }
    }else{
          
        response.status(404).send("Dados em formato incorreto");
    }
})

server.post('/update', async (request, response)=>{
    let {token} = request.body;

    console.log("Este e o token enviado" + token);

    let decode = await validationJwt(token);

    if(decode.status == 200){

        const type = request.body;

            const {oldIdentifier, newIdentifier, senha} = request.body;

            const boResult = Vdl.vdlIdeficadorUp(oldIdentifier, newIdentifier, senha);

            if(boResult){
                let upData;
                
                switch(type){

                    case "email": 
                        upData = dataBase.update(
                            "email", 
                            oldIdentifier, 
                            newIdentifier, 
                            senha
                        );
                    break

                    case "number": 
                        upData = dataBase.update(
                            "number",
                            oldIdentifier, 
                            newIdentifier, 
                            senha
                        );
                }

                if(upData){

                    response.status(204).send(decode.token);

                }else{

                    response.status(404).send(decode.token + "Erro de execulção");

                }
            }else{

                response.status(404).send(decode.token + "Formato invalido");

            }
    }else{

        response.status(401).send("Token invalido");

    }
})

server.post('/delete', async(request, response) => {
    let {token, value} = request.body;

    let decode = validationJwt(token);

    if(decode.status == 200){

        
        
    }else{

        response.status(401).send();
    }
})
//-------------
server.listen({
    port: 4047
})