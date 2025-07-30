import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/servicies/product.service';
import { SnackbarService } from 'src/app/servicies/snackbar.service';
import { CategoryService } from 'src/app/servicies/category.service';
import { GlobalContants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    FlexLayoutModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule, 
    MatOptionModule, 
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent  implements OnInit{
  onAddProduct = new EventEmitter();
  onEditCategory = new EventEmitter();
  onEditProduct = new EventEmitter();
  onEmitStatusChange = new EventEmitter();

  ProductForm = new  FormGroup({
      name:  new  FormControl("" ,  [Validators.required, Validators.pattern(GlobalContants.nameRegex)] )   , 
      categoryId: new FormControl('', [Validators.required]),
      price: new FormControl(null, [Validators.required,Validators.pattern("^[0-9]*$")]),
      description: new FormControl(null, [Validators.required]),
  });
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;
  categories: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductComponent>,
    private categoryService: CategoryService,
    private snackbarService: SnackbarService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.getCategories(); 
    
    console.log(this.ProductForm);

  
  
 // Appel pour charger les catégories
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (response:any) => {
        console.log('Catégories récupérées:', response);
        this.categories = response;
        this.cdr.detectChanges(); // Forcer la détection des changements
      },
      (error:any) => {
        this.dialogRef.close();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalContants.error
        );
      }
    );
  }

  handleSubmit() {
   if (this.dialogAction === 'Edit') {
      this.edit();
    } else {
     
    }
    this.add();
  }

  add() {
    var formData = this.ProductForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };

    this.productService.add(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onAddProduct.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackbar(this.responseMessage, 'succès');
      },
      (error) => {
       this.dialogRef.close();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalContants.error
        );
      }
    );
  }

 edit() {
    var formData = this.ProductForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
    };

    this.productService.update(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        this.onEditProduct.emit();
        this.responseMessage = response.message;
        this.snackbarService.openSnackbar(this.responseMessage, 'succès');
      },
      (error) => {
        this.dialogRef.close();
        console.log(error.error?.message);
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalContants.genericError;
        }
        this.snackbarService.openSnackbar(
          this.responseMessage,
          GlobalContants.error
        );
      }
    );
  }
}

