import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncryptionService } from '../../services/encryption.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[ReactiveFormsModule]
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private encryptionService: EncryptionService,
    private http: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;

        const encryptedUsername = await this.encryptionService.encrypt(formValues.username);
        const encryptedPassword = await this.encryptionService.encrypt(formValues.password);

        const payload = {
          email: encryptedUsername,
          password: encryptedPassword,
        };
        
        this.http.auth(payload).subscribe({
          next: (response) => {
            this.http.storeToken(response.token);
            this.router.navigateByUrl(`funcionarios`, {skipLocationChange: true});
          },
          error: (error) => {
            console.error('Erro no login:', error);
          },
        });
    } else {
      console.warn('Formulário inválido!');
    }
  }
}
