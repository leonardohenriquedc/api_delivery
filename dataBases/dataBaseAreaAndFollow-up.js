export class tables{
    FollowUp(){
       let follows = {
            "Diaristas": [
                'limpeza',
                'Cozinha',
                'casa'
            ],
            "TI": [
                'Programação',
                'Ciber Segurança',
                'Automação',
                'Ciencias de Dados / Analise de Dados',
                'Infraestrutura',
                'Redes', 
                'Internet das Coisas', 
                'Computação em Nuvem',
            ],
            "Marketing e Vendas": [
                'Publicidade',
                'E-mail Marketing',
                'Vendas',
                'Gestão',
                'Community Management'
            ],
            "Design e Multimedia": [
                'Design grafico',
                'Design de Produto',
                'Design de Moda',
                'Design de Games',
                'Web Design / UX/UI',
                'Design Imobiliario',
                'Produção Audio Visual',
                'Produção de artistica',
                'Produção de Animação',
                'Ilustrações',
                'Modelos 3D',
                'Info Graficos',
                'Design de Logo'
            ],
            "Administração": [
                'Contabilidade',
                'Planejamento',
                'Controle de Dados',
                'Organização E Controle de Processos',
                'CRM',
                'Controle e Analise de Dados'
            ],
            "Jurídico": [
                'Advocacia',
                'Acessoria',
                'Fiscalização',
                'Auditoria'
            ],
            "Engenharia": [
                'Desenhos em CAD',
                'Civil',
                'Arquitetura',
                'Eletrica',
                'Computação',
                'Industrial',
                'Sanitaria',
                'Alimenticia',
                'Eletronica'
            ]
       }

       return follows
    }

    Areas(){
        let seguimentos = [
            'Diaristas', 
            'TI', 
            'Marketing e Vendas', 
            'Design e Multimedia', 
            'Administração', 
            'Jurídico', 
            'Engenharia'
        ]

        return seguimentos
    }

    niveis(){
        let niveis = [
            'Administrador',
            'Cliente',
            'Profissional'
        ]
    }
}