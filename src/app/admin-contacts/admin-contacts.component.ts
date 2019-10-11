import { Component, OnInit } from '@angular/core';
import { WaterService } from '../services/water.service';
import { Contact } from '../services/models';
import { AddService } from '../services/add.service';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-admin-contacts',
  templateUrl: './admin-contacts.component.html',
  styleUrls: ['./admin-contacts.component.less']
})
export class AdminContactsComponent extends AddService implements OnInit {
  contacts:Contact[] = null;
  constructor( private _ws:WaterService, private _fb:FormBuilder) {
    super();
   }

  ngOnInit() {
    this._ws.getContacts().subscribe(contacts => {
      this.contacts = contacts;
      console.log(this.contacts)
      this.items = contacts;
    })

    this.addForm = this._fb.group({
      Head:[null, Validators.required],
      Time:[null, Validators.required],
      Boss:[null],
      Tel: new FormGroup({
        0: new FormControl(null, [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)])
      }),
      Address: new FormGroup({
        0: new FormControl(null, Validators.required)
      }),
      Email: new FormGroup({
        0: new FormControl(null, [Validators.required, Validators.email])
      })
    })

    console.log(this.addForm)
  }


  public setForm(id): void{
    this.submitted = true;
    this.item = this.contacts.find(c => c.Id == id);
    
    this.addForm = this._fb.group({
      Head: this.item.Head, 
      Time: this.item.Time, 
      Boss: this.item.Boss,
      Tel: new FormGroup({}),
      Address: new FormGroup({}),
      Email: new FormGroup({})
    });

    const tels = (<FormGroup>this.addForm.get('Tel'));
    const addresses = (<FormGroup>this.addForm.get('Address'));
    const emails = (<FormGroup>this.addForm.get('Email'));

    this.item.Tel.forEach((t,i) => {
      tels.addControl(i, new FormControl(t,[Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]))
      console.log(tels)
    })
    this.item.Address.forEach((t,i) => {
      addresses.addControl(i, new FormControl(t,[Validators.required]))
    })
    this.item.Email.forEach((t,i) => {
      emails.addControl(i, new FormControl(t,[Validators.required, Validators.email]))
    })
    console.log(this.addForm)
    this.update = {};
  }

  addContact(formControlName: string){
    const formControl = (<FormGroup>this.addForm.get(formControlName));
    const validators:ValidatorFn[] = [Validators.required];
    if(formControlName == 'Tel'){
      validators.push(Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/));
    }
    if(formControlName == 'Email'){
      validators.push(Validators.email);
    }
    formControl.addControl((Object.keys(formControl.controls).length).toString(), new FormControl(null, validators))
  }

  getFormControls(form: string){
    return Object.values((<FormGroup>this.addForm.get(form)).controls)
  }

  clearContact(formControlName: string, formName: string){
    const form = (<FormGroup>this.addForm.get(formName));
    form.removeControl(formControlName.toString());
    
  }

  save(){
    this.submitted = true;
    if(this.addForm.invalid){
      return;
    }
    if(this.item){
      this.updateContact();
    }else{
      this.saveContact();
    }
  }

  saveContact(){
    let contact = this.addForm.value;
    contact.Tel = Object.values(contact.Tel);
    contact.Address = Object.values(contact.Address);
    contact.Email = Object.values(contact.Email);
    this._ws.addContact(contact).subscribe(id => {
      this.items.push({Id:id, ...contact});
      this.addForm.reset()
    })
  }

  updateContact(){
    this.update['Id']=this.item.Id;
    this._ws.updateContact(this.update).subscribe(id => {
      this.item = JSON.parse(JSON.stringify(this.update));
    })
  }

}
