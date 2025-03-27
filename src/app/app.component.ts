import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FuncionariosModule } from './pages/funcionarios/funcionarios.module';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    LoginComponent,
    FuncionariosModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ambev-gestao-funcionarios';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router){
    this.authService.isLoggedIn$.subscribe((status) => {
        this.isLoggedIn = status;
    });

    if(this.isLoggedIn)
      this.router.navigateByUrl(`funcionarios`, {skipLocationChange: false});
  }
}
