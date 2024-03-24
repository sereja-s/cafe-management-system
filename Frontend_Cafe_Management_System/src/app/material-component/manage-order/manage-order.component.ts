import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  //creating few columns and fields
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categories: any = [];
  products: any = [];    //we're also expcting products
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,        //importing few things
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {              //creating the form
    this.ngxService.start();
    this.getCategories();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]

    })
  }

  //to laod the data(all the categories)
  getCategories() {
    this.categoryService.getCategory().subscribe((response: any) => {
      this.ngxService.stop();
      this.categories = response;
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  //method to get product by category
  getProductsByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');         //we'll set the value of the price field
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  //method to get product details
  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((response: any) => {
      this.price = response.price;
      this.manageOrderForm.controls['price'].setValue(response.price);         //we'll set the value of the price field
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.price * 1);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }


  //method to change the quantity of products, the initial quantity is 1
  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);    //  Total = quantity*price   ,    setting the total field
    }
    else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);    //  Total = quantity*price   ,    setting the total field

    }
  }

  //to validate the product add button, enable the add button only when a value is there
  validateProductAdd() {
    //here total is an input field, if its value is 0 or null, disable the button
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <= 0)
      return true;

    else
      return false;
  }

  //to validate 
  validateSubmit() {        
    //condition to disable the button
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null || this.manageOrderForm.controls['email'].value === null || 
    this.manageOrderForm.controls['contactNumber'].value === null || this.manageOrderForm.controls['paymentMethod'].value === null || 
    !(this.manageOrderForm.controls['contactNumber'].valid) || !(this.manageOrderForm.controls['email'].valid))
      return true;

    else
      return false;
  }

  //to add the product in our table
  add(){
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e:{id:number;})=>e.id == formData.product.id);      //we'll find on the basis of id
    if(productName === undefined){    //means product does not exist in that particular table
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push({id:formData.product.id,name:formData.product.name,category:formData.category.name,quantity:formData.quantity,price:formData.price,total:formData.total});
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded,"success");
    }     
    else{
      this.snackbarService.openSnackBar(GlobalConstants.productExistError,GlobalConstants.error);
    }
  }

  //to delete the product in the dataSource
  handleDeleteAction(value:any,element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1);
    this.dataSource = [...this.dataSource];
  }

  //for the final submit
  submitAction(){
    this.ngxService.start();
    var formData = this.manageOrderForm.value;
    var data = {
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      paymentMethod:formData.paymentMethod,
      totalAmount:this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
    },(error:any)=>{
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  downloadFile(fileName:any){
    var data = {
      uuid:fileName
    }
    this.billService.getPDF(data).subscribe((response:any)=>{
      saveAs(response,fileName+'pdf');
      this.ngxService.stop();
    })
  }


}
