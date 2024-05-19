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
    secret: process.env.SECRET_KEY
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

server.post('/cadList', (request, response) => {
    let cad = dataBase.cadView(request.body) 
})

server.post('/delete', (request, response) => {
    dataBase.delete(request.body)
    response.status(200).send()
})
//-----------------

server.listen({
    port: 4047
})