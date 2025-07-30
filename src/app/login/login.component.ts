import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../servicies/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../servicies/snackbar.service';
import { GlobalContants } from '../shared/global-constants';
import { error } from 'console';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide = true;
  loginFrom: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loginFrom = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalContants.emailRegex)],
      ],
      password: [null, [Validators.required]],
    });
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.loginFrom.value;
    const data = {
      email: formData.email,
      password: formData.password,
    };
  
    console.log('Form Data:', data);
    console.log('Form Valid:', this.loginFrom.valid);
  
    this.userService.login(data).subscribe(
      (response: any) => {
        console.log('Response from backend:', response);
        this.ngxService.stop();
        this.dialogRef.close();
  
        // Vérifie si le token est présent dans la réponse
        console.log('Tentative de stockage du token:', response.token);
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Token stocké dans le localStorage:', localStorage.getItem('token'));
        } else {
          console.error('Le token est absent dans la réponse.');
        }
  
        // Redirection après la connexion réussie
       // console.log('Redirection vers /cafe/dashboard');
        //this.router.navigate(['/cafe/dashboard']);

        setTimeout(() => {
          this.router.navigate(['/cafe/dashboard']);
        }, 1000);
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackbar(this.responseMessage, GlobalContants.error);
      }
    );
  }
}
