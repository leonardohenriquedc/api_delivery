export class DataHora{

    constructor(dia, mes, ano, hora, min, second) {
        this.ano = ano;

        this.mes = mes;

        this.dia = dia;

        this.hora = hora;

        this.min = min;

        this.second = second;

        this.fullYear = `${this.ano}-${this.mes}-${this.dia} ${this.hora}:${this.min}:${this.second}`;
    }

    capturandoData(){
        let date = new Date();

        this.ano = date.getFullYear();

        this.mes = String(date.getMonth()).padStart(2, "0");

        this.dia = String(date.getDate()).padStart(2, "0");

        this.hora = String(date.getHours()).padStart(2, "0");

        this.min = String(date.getMinutes()).padStart(2, "0");

        this.second = String(date.getSeconds()).padStart(2, "0");

        return this.fullYear  = `${this.ano}-${this.mes}-${this.dia} ${this.hora}:${this.min}:${this.second}`;
    }
}