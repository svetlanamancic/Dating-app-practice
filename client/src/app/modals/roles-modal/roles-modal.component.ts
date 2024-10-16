import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { SharedModule } from '../../_modules/shared.module';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { User } from '../../_models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [SharedModule, FormsModule, CommonModule],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.css'
})
export class RolesModalComponent implements OnInit{
  @Input() updateSelectedRoles = new EventEmitter();
  user: User;
  roles: any[];


  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
  }

  updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }

}
