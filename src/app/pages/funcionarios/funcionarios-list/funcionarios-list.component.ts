import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionariosService } from '../../../services/funcionarios.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmComponent } from '../../../shared/modal-confirm/modal-confirm.component';
import { TableActionComponent } from "../../../shared/table-action/table-action.component";


@Component({
  selector: 'app-funcionarios-list',
  imports: [RouterLink, CommonModule, ModalConfirmComponent, TableActionComponent],
  templateUrl: './funcionarios-list.component.html',
  styleUrl: './funcionarios-list.component.css'
})

export class FuncionariosListComponent implements OnInit{
  @ViewChild('confirmModal') confirmModal!: ModalConfirmComponent;
  
  constructor(
    private service: FuncionariosService,
    private toastr: ToastrService,
    private router: Router
  ){}

  columns = [
    { header: 'Nome', field: 'nomeCompleto' },
    { header: 'E-mail', field: 'email' },
    { header: 'Gestor', field: 'nomeGestor' },
  ]
  funcionarios: Funcionario[] = [];
  funcionarioIdDelete!: string;
  exibeModal: boolean = false;
  errorMessage: string = "";

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next:(data) => {
        data.forEach((funcionario) => funcionario.nomeCompleto = `${funcionario.nome} ${funcionario.sobrenome}`)
        this.funcionarios = data;
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    });
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  openModal(funcionarioId: string): void {
    this.funcionarioIdDelete = funcionarioId;
    this.confirmModal.openModal();
  }

  editFuncionario(funcionario: any):void{
    this.router.navigateByUrl(`funcionarios/${funcionario.id}/editar`, {skipLocationChange: false});
  }

  //confirmar exclusão
  deleteFuncionario(): void {
    if (this.funcionarioIdDelete !== null) {
      this.service.delete(this.funcionarioIdDelete).subscribe({
        next:() => {
          this.toastr.success("Funcionário excluído com sucesso!");
          this.ngOnInit();
        },
        error: (error) => {
          this.toastr.error(error.message);
        }
      });
    }
    this.confirmModal.closeModal();
  }
}
