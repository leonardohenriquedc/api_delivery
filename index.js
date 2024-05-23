import fastify from "fastify";
import fastifyJwt from "fastify-jwt";
import { DataBase } from "./dataBases/dataBaseSql.js";
import { Vdl } from "./validations/validationsCRUD.js";
import dotenv from "dotenv";

dotenv.config()

let dataBase = new DataBase()

let server = fastify({logger: true})

let vdl = new Vdl()

server.register(fastifyJwt, {
    secret: process.env.SECRET_KEY,
    sign: {
        expiresIn: '5m'
    }
})

server.get('/', (request, response) => {
    response.status('200').send('deu bom')
})

//Create CRUD
server.post('/create', async(request, response) => {
    let vdlC = vdl.vdlCreate(request.body)
    if(vdlC == 404){
        response.status(404).send()
    }else{
        let sucess = await dataBase.create(request.body)

        if(sucess){
            response.status(204).send()
        }else{
            response.status(404).send()
        }
    }
})

//ID e o cpf, 
server.post('/login', async (request, response) => {
    let resL = await dataBase.login(request.body)
    
    if(resL.status == 200){
        const name = resL.username[0].nome;
        try{
            // adicionar numero de celular 
            const token = server.jwt.sign({name: name});
            response.status(200).send({token});
        }catch (error){
            console.log('Deu ruim', error);
            response.status(404).send()
        }
    }else{
        response.status(404).send('Deu ruim')
    }
})

server.post('/update', async (request, response)=>{
    // request.body: type(e(email), s(senha), nm(nome), nr(numero)), token,  body(former info, new info, validation info);
    let {token} = request.body
    let decode = server.jwt.verify(token)
    if(decode.name != undefined){
        let {type, body} = request.body;
        let value = await dataBase.update(type, body)

        if(value == 204){
            response.status(204).send()
        }else{
            response.status(404).send()
        }
    }else{
        response.status(401).send()
    }
})

server.post('/cadList', async (request, response) => {
    let { token, nivel } = request.body;
    let decode = server.jwt.verify(token);
    
    if(decode.name != undefined && nivel == 'Administrador'){
        let cad = await dataBase.cadView()
        if(cad.status == 200){
            let newToken = server.jwt.sign({name: decode.name})
            let obj = {
                token: newToken,
                data: cad.datas
            }
            response.status(200).send(JSON.stringify(obj))
        }else{
            response.status(404).send(JSON.stringify({token: newToken}))
        }
    }else{
        response.status(401).send()
    }
})

server.post('/delete', async(request, response) => {
    let {token, value} = request.body;
    let decode = server.jwt.verify(token);
    if(decode != undefined){
        let dataDelete = await dataBase.delete(value);
        if(dataDelete.status == 200){
            response.status(200).send();
        }else{
            response.status(404).send(dataDelete.error);
        }
    }else{
        response.status(401).send();
    }
})
//-----------------
server.listen({
    port: 4047
})