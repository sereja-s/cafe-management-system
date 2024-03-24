import { Component, OnInit, EventEmitter, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction:any = "Add";
  action:any = "Add";
  responseMessage:any;
  categories:any = [];


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private productService:ProductService,
  public dialogRef:MatDialogRef<ProductComponent>,
  private categoryService:CategoryService,
  private snackbarService:SnackbarService){}

  ngOnInit(): void {        //creating the form
    this.productForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]], 
      categoryId:[null,Validators.required],
      price:[null,Validators.required],
      description:[null,Validators.required]
    })

    //using the same model/dialog for edit
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategories();             //calling the getCategories() method
  }

  //method to get all categories from our database 
  getCategories(){
    this.categoryService.getCategory().subscribe((response:any)=>{
      this.categories = response;
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  handleSubmit(){         //method called whenever submit button is hit
    if(this.dialogAction === 'Edit'){
      this.edit();      
    }
    else{
      this.add();
    }
  }

  add(){
    var formData = this.productForm.value;//whenever add() method is called we need to call an API
    var data = {    
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }
    this.productService.add(data).subscribe((response:any)=>{           //we'll send all this data to the backend whenever we wnat to add a new product
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");           //passing the responseMessage to the snackbar
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })       
  }

  edit(){
    var formData = this.productForm.value;//whenever edit() method is called we need to call an API
    var data = {    
      id: this.dialogData.data.id,        //we also need to pass the data id here
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }
    this.productService.update(data).subscribe((response:any)=>{    //calling the update service
      this.dialogRef.close();
      this.onEditProduct.emit();    //we have to emit on edit only 
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");           //passing the responseMessage to the snackbar
    },(error:any)=>{        //error handling
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}

 