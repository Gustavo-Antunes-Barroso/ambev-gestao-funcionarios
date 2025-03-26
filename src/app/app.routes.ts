import { Routes } from '@angular/router';
import { FuncionariosListComponent } from './pages/funcionarios/funcionarios-list/funcionarios-list.component';
import { FuncionariosDetailsComponent } from './pages/funcionarios/funcionarios-details/funcionarios-details.component';

export const routes: Routes = [
    {path: 'funcionarios', component: FuncionariosListComponent},
    {path: 'funcionarios/criar', component: FuncionariosDetailsComponent},
    {path: 'funcionarios/:id/editar', component: FuncionariosDetailsComponent},
];
