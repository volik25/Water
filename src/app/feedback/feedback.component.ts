import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WaterService } from '../services/water.service';
import { LoadService } from '../services/load.service';
import { nlBeLocale } from 'ngx-bootstrap';

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

  topics = [
    "Оплата услуг",
    "Восстановление благоустройства",
    "Письмо директору",
    "Выдача технических условий",
    "Аварийная ситуация",
    "Сообщи, где воруют воду?!",
    "Тарифы и услуги",
    "Коррупционная составляющая, вымогательство",
    "Некачественная вода",
    "Прочее",
    "ВОПРОСЫ БЕЗОПАСНОСТИ",
  ]

  send(){
    this.submitted=true;
    if(this.contactForm.invalid){
      return;
    }
    let app = {
        Name:this.contactForm.value.Name,
        Phone:this.contactForm.value.Phone,
        Email:this.contactForm.value.Email,
        Topic:this.contactForm.value.Topic,
        Description:this.contactForm.value.Description
    }
    this.ws.addApp(app).subscribe(data =>{
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
      Topic: [''],
      Description: ['', Validators.required],
      Policy: ['', Validators.requiredTrue]
    });
  };
  get f() { return this.contactForm.controls; };
}
