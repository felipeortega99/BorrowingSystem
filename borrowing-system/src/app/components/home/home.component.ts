import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  rentProductForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.rentProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      studentNumber: ['', Validators.required]
    });
  }
  get f() { return this.rentProductForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.rentProductForm.invalid) {
      return;
    }
  }
}
