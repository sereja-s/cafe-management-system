import { Routes } from '@angular/router';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ViewBillComponent } from './view-bill/view-bill.component';



export const MaterialRoutes: Routes = [
    {
        path:'category',            //path name
        component:ManageCategoryComponent,       //the component in which we want to route, whenever this path is triggered
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']      //the manage category page is accessible for admin only
        }
    },
    
    {
        path:'product',            //path name
        component:ManageProductComponent,       //the component in which we want to route, whenever this path is triggered
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']      //the manage product page is accessible for admin only
        }
    },
    
    {
        path:'order',            
        component:ManageOrderComponent,       
        data:{
            expectedRole:['admin','user']    
        }
    },
    {
        path:'bill',            
        component:ViewBillComponent,       
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin','user']      
        }
    },
    {
        path:'user',            
        component:ManageUserComponent,       
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']      
        }
    }
];
