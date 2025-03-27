export class Funcionario{
    id!: string;
    nome!: string;
    sobrenome!: string;
    nomeCompleto!: string;
    email!: string;
    documento!: string;
    telefone!: string;
    nomeGestor!: string|undefined;
    dataNascimento!: Date;
    isGestor: boolean = false;
    idGestor!: string;
    senha!: string;
}