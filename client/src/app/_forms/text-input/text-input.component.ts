import { CommonModule } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { SharedModule } from '../../_modules/shared.module';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent implements ControlValueAccessor{
  @Input() label: string;
  @Input() type = 'text';

  constructor(@Self() public ngControl: NgControl) { 
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

}
