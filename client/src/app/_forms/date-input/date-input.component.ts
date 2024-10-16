import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import { SharedModule } from '../../_modules/shared.module';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [
    CommonModule, 
    SharedModule, 
    ReactiveFormsModule
  ],
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.css'
})
export class DateInputComponent implements ControlValueAccessor{
  @Input() label: string;
  @Input() maxDate: Date;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD MMM YYYY'
    };
  }
  
  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }


}
