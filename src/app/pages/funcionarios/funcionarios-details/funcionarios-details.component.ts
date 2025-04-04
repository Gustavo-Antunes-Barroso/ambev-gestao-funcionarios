import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import  { Funcionario } from '../../../models/funcionario.model'
import { FuncionariosService } from '../../../services/funcionarios.service';

import { switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DocumentMaskDirective } from '../../../directives/document-mask-directive';
import { PhoneMaskDirective } from '../../../directives/phone-mask-directive';
import { EncryptionService } from '../../../services/encryption.service';

@Component({
  selector: 'app-funcionarios-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DocumentMaskDirective,
    PhoneMaskDirective
  ],
  templateUrl: './funcionarios-details.component.html',
  styleUrl: './funcionarios-details.component.css'
})

export class FuncionariosDetailsComponent implements OnInit, AfterContentChecked {
  constructor(
    private service: FuncionariosService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private encryptService: EncryptionService
  ){}

  currentAction: string = "";
  funcionarioForm!: FormGroup;
  selectOptions: { id: string; nome: string }[] = [];
  pageTitle: string = "";
  serverErrorMessages: string[] = [];
  submittingForm: boolean = false;
  funcionario!: Funcionario;
  loading: boolean = true;

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildFuncionarioForm();
    this.loadOptions();
    this.loadFuncionario();

    this.funcionarioForm.valueChanges.subscribe(values => {
      this.funcionario = { ...this.funcionario, ...values };
    });
  }


  private setCurrentAction(){
    this.currentAction = this.route.snapshot.url[1].path.toLowerCase() == 'criar' ? 'criar' : 'editar';
  }

  private buildFuncionarioForm(){
    this.funcionarioForm = this.formBuilder.group({
        nome: [null, [Validators.required, Validators.minLength(2)]],
        sobrenome: [null, [Validators.required, Validators.minLength(4)]],
        email: [null, [Validators.required, Validators.email]],
        documento: [null, [Validators.required, Validators.pattern(/^\d{7,11}$/)]],
        telefone: [null, [Validators.required,Validators.pattern(/^(\d{10}|\d{11})$/)]],
        dataNascimento: [null, [Validators.required]],
        idGestor: [null],
        isGestor: [false, [Validators.required]],
        senha: [null, [Validators.required, Validators.minLength(10)]]
      })
  }

  private loadFuncionario(){
    if(this.currentAction === 'editar'){
      this.route.paramMap.pipe(
        switchMap(params => this.service.getById(`${params.get("id")}`))
      )
      .subscribe({
        next: (funcionario) => {
          this.funcionario = funcionario;
          this.funcionario.senha = this.encryptService.decrypt(this.funcionario.senha);
          this.funcionarioForm?.patchValue(this.funcionario);
          this.funcionarioForm.get('idGestor')?.setValue(this.funcionario.idGestor);
          this.loading = false;
        },
        error: (error) => {
          if(!error.status)
            this.toastr.error(error.error.message);
        }
      })
    }else{
      this.loading = false;
    }
  }

  private loadOptions(){
    this.service.getAll(true).subscribe({
      next:(data) => {
        this.selectOptions = data.map(x => ({ id: x.id, nome: `${x.nome} ${x.sobrenome}` }));
      },
      error: (error) => {
        if(!error.status)
          this.toastr.error(error.error.message);
      }
    });
  }

  private setPageTitle(){
    this.pageTitle = this.currentAction === 'criar'? 'Cadastrar Funcionário' : 'Editar Funcionário';
  }

  public submitForm(){
    this.submittingForm = true;
    this.currentAction === 'criar'? this.criarFuncionario() : this.editarFuncionario();
    this.submittingForm = false;
  }

  private criarFuncionario(){
    this.tratarFuncionarioEnvio();
    this.service.post(this.funcionario).subscribe
    ({
      next: (funcionario) =>{
        this.funcionario = funcionario;
        this.toastr.success("Funcionário criado com sucesso!");
        this.redirecionarNavegacao(`/${this.funcionario.id}/editar`);
      },
      error: (error) =>{
        this.toastr.error(error.error.message);
      }
  })
  }

  private editarFuncionario(){
    this.tratarFuncionarioEnvio();
    this.service.put(this.funcionario).subscribe
    ({
      next: (data) =>{
        this.toastr.success("Funcionário editado com sucesso!");
        this.redirecionarNavegacao(null);
      },
      error: (error) =>{
        this.toastr.error(error.error.message);
      }
    })
  }

  private redirecionarNavegacao(rota: string|null){
    rota = rota === null ? '' : rota;
    this.router.navigateByUrl(`funcionarios${rota}`, {skipLocationChange: true});
  }

  private tratarFuncionarioEnvio(){
    this.funcionario.isGestor = `${this.funcionario.isGestor}` == "true";
    this.funcionario.senha = this.encryptService.encrypt(this.funcionario.senha);
    if(this.funcionario.idGestor != null)
      this.funcionario.nomeGestor = this.selectOptions.find(x => x.id == this.funcionario.idGestor)?.nome
  }
}
