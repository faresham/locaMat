import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {HomeComponent} from './home/home.component';
import {ReservationComponent} from './reservation/reservation.component';
import {AddEditDeviceComponent} from './add-edit-device/add-edit-device.component';
import {UserManagementComponent} from './user-management/user-management.component';
import { ReservationManagementComponent } from './reservation-management/reservation-management.component';
import { DeviceManagementComponent } from './device-management/device-management.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: AuthComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'add-device', component: AddEditDeviceComponent },
  { path: 'edit-device/:id', component: AddEditDeviceComponent },
  { path: 'admin/user-management', component: UserManagementComponent },
  { path: 'admin/device-management', component: DeviceManagementComponent },
  { path: 'admin/reservation-management', component: ReservationManagementComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
