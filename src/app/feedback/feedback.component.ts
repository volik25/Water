import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WaterService } from '../services/water.service';
import { LoadService } from '../services/load.service';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.less']
})
export class FeedbackComponent implements OnInit {
  contactForm:FormGroup;
  submitted = false;
  success = false;
  constructor(private fb:FormBuilder, private ws:WaterService, private ls:LoadService) { }

  ngOnInit() {
    this.setForm();
  }

  send(){
    this.submitted=true;
    if(this.contactForm.invalid){
      return;
    }
    this.ws.addApp(this.contactForm.value).subscribe(data =>{
      this.submitted = false;
      this.success = true;
      this.setForm();
    });
  }

  sucChange(){
    this.success = false;
  }

  setForm(){
    this.contactForm = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', Validators.pattern("^((\\+?7|8)[ \\-] ?)?((\\(\\d{3}\\))|(\\d{3}))?([ \\-])?(\\d{3}[\\- ]?\\d{2}[\\- ]?\\d{2})$")],
      Description: ['', Validators.required]
    });
  };
  get f() { return this.contactForm.controls; };
}
