import fastify from "fastify";
import { DataBase } from "./dataBases/dataBaseSql.js";
import { Vdl } from "./validations/validationsCRUD.js";

let dataBase = new DataBase()

let server = fastify()

let vdl = new Vdl()

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

server.post('/update', (request, response)=>{
    const up = dataBase.update(request.body)
    if(up =! 404){
        response.send(up)
    }else{
        response.status(500).send()
    }
})

server.post('/cadList', (request, response) => {
    let cad = dataBase.cadView(request.body)
    response.status(200).send(cad)
})

server.post('/delete', (request, response) => {
    dataBase.delete(request.body)
    response.status(200).send()
})
//-----------------

server.post('/login', (request, response) => {
    const data = request.body
    
})
server.listen({
    port: 4047
})