import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {HomeComponent} from './home/home.component';
import { AddDeviceComponent } from './add-device/add-device.component'; 


const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'login', component: AuthComponent},
  { path: 'add_device', component: AddDeviceComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
