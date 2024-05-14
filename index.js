import fastify from "fastify";
import { DataBase } from "./dataBases/dataBaseMemory.js";

let dataBase = new DataBase()

let server = fastify()

//Create CRUD
server.post('/create', (request, response) => {
    const sucess = dataBase.create(request.body)
    response.send(sucess)
})

server.post('/update', (request, response)=>{
    const up = dataBase.update(request.body)
    if(up =! 404){
        response.send(up)
    }else{
        response.status(500).send()
    }
})


server.listen({
    port: 4047
})