import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../_modules/shared.module';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { DateInputComponent } from '../_forms/date-input/date-input.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    SharedModule, 
    ReactiveFormsModule, 
    TextInputComponent, 
    DateInputComponent,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit{

  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  registerForm: FormGroup;
  maxDate: Date;

  validationErrors: string[] = [];

  constructor(private accountService: AccountService, 
    private toastr:ToastrService,
    private fb: FormBuilder,
    private router: Router) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate =  new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, 
        Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, 
        this.matchValues('password')]],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value 
        ? null : {isMatching: true};
    }
  }

  register()
  {
    this.accountService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/members');
      },
      error: (err) => this.validationErrors = err
      }
    );
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
