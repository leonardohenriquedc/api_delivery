export class Vdl {
    async vdlCreate(infos){
        let {email, cpf, numerocelular, datanasc, hashtag, categoria} = infos;

        //validação: CPF, numerocelular, datanasc, hastag e seguimento
        // cpf = 11
        let LCpf = cpf.length
        // numerocelular = 13
        let LNC = numerocelular.length;
        // datanasc = "YYYY-MM-DD"
        let LDnasc = () => {
            // Primeiro, verifique o formato usando uma expressão regular
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

        // Lth and Lsg is boolean: false or true
        let Lht = Array.isArray(hashtag)
        let Lsg = Array.isArray(categoria)

        if (LCpf !== 11 || LNC !== 13 || !LDnasc() || !Lht || !Lsg || !Leml) {
            return 404;
        } else {
            return true;
        }
    }
}