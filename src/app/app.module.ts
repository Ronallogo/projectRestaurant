import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material-module';
import { HomeComponent } from './home/home.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/header/header.component';
import { AppSidebarComponent } from './layouts/sidebar/sidebar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { NgxUiLoaderConfig, NgxUiLoaderModule, SPINNER } from 'ngx-ui-loader';
import { MatButtonModule } from '@angular/material/button'; // Ajoutez ceci si vous utilisez des boutons
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ConfirmationComponent } from './material-component/dialog/confirmation/confirmation.component';
import { ChangePasswordComponent } from './material-component/dialog/change-password/change-password.component';
import { ManageCategoryComponent } from './material-component/manage-category/manage-category.component';
import { CategoryComponent } from './material-component/dialog/category/category.component';
import { ManageProductComponent } from './material-component/manage-product/manage-product.component';
import { ProductComponent } from './material-component/dialog/product/product.component';
import { ManageOrderComponent } from './material-component/manage-order/manage-order.component';
import { MaterialComponentsModule } from './material-component/material.module'; // Assurez-vous que ce chemin est correct
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ViewBillComponent } from './material-component/view-bill/view-bill.component';
import { ManageUserComponent } from './material-component/manage-user/manage-user.component';






// Import des modules Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './servicies/token-interceptor.interceptor';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';




const ngxUiLoaderConfig:NgxUiLoaderConfig ={
  text:"Patientez....",
  textColor : "#FFFFFF",
  textPosition :"center-center",
  bgsColor : "#A7E0E0",
  fgsColor :"#679436",
  fgsType :SPINNER.cubeGrid,
  fgsSize :80,
  hasProgressBar:false

}



@NgModule({
  declarations: [	
    AppComponent,
    HomeComponent,
    BestSellerComponent,
    FullComponent,
    AppHeaderComponent,
    AppSidebarComponent,

    
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule,
    SignupComponent,
    ForgotPasswordComponent, 
    LoginComponent, 
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ConfirmationComponent,
    ChangePasswordComponent,
    ManageCategoryComponent,
    CategoryComponent,
    ManageProductComponent,
    ProductComponent,
    ManageOrderComponent,
    MatSelectModule,
    MaterialComponentsModule,
    MatSlideToggleModule,
    ViewBillComponent,
    BrowserAnimationsModule,
    MatInputModule,
    MatOptionModule, 
    ManageUserComponent,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    



  ],
  providers: [

    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
