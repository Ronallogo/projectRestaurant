import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';
import { CategoryService } from 'src/app/servicies/category.service';
import { SnackbarService } from 'src/app/servicies/snackbar.service';
import { GlobalContants } from 'src/app/shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
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
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  CategoryForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';

  responseMessage: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoryComponent>,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.CategoryForm = this.formBuilder.group({
      name:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.CategoryForm.patchValue(this.dialogData.data);
    }
  }


  handleSubmit(){
    if(this.dialogData.action === 'Edit'){
      this.edit();
    }
    else{
      this.add();
    }
  }

  add(){
    var formData = this.CategoryForm.value;
    var data = {
      name:formData.name
    }

    this.categoryService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage, "succès")
    },
    (error)=>{
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
    })
  }

  edit(){
    var formData = this.CategoryForm.value;
    var data = {
      id:this.dialogData.data.id,
      name:formData.name
    }

    this.categoryService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackbar(this.responseMessage, "succès")
    },(error)=>{
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
    })
  }
}
