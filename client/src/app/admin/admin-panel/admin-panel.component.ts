import { Component } from '@angular/core';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserManagementComponent } from '../user-management/user-management.component';
import { PhotoManagementComponent } from '../photo-management/photo-management.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    HasRoleDirective, 
    TabsModule, 
    UserManagementComponent, 
    PhotoManagementComponent
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

}
