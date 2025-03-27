import { Routes } from '@angular/router';
import { FuncionariosListComponent } from './pages/funcionarios/funcionarios-list/funcionarios-list.component';
import { FuncionariosDetailsComponent } from './pages/funcionarios/funcionarios-details/funcionarios-details.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: 'funcionarios', component: FuncionariosListComponent, canActivate: [AuthGuard]},
    {path: 'funcionarios/criar', component: FuncionariosDetailsComponent, canActivate: [AuthGuard]},
    {path: 'funcionarios/:id/editar', component: FuncionariosDetailsComponent, canActivate: [AuthGuard]},
];
