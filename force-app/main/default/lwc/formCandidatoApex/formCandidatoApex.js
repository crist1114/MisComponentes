import { LightningElement,wire,track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getAsesores from '@salesforce/apex/FormController.getAsesores';
import agregarLead from '@salesforce/apex/FormController.agregarLead';

export default class FormCandidatoApex extends LightningElement {

@track cargoDatos;
@track thankyou=false;
@track firstname='';
@track lastname='';
@track company='';
@track email='';

@track value;
@track valueCombobox;
noVieneAccount;
options=[];

@wire(CurrentPageReference)
currentPageReference;


renderedCallback() {
    this.cargarDatos();
}

handleInputChange(event){
    const fieldName = event.target.dataset.field;
    this[fieldName] = event.target.value;
}

cargarDatos() {
    if (this.currentPageReference && this.currentPageReference.state) {
        this.value = this.currentPageReference.state.id;
        if(this.value === undefined){
            this.noVieneAccount=true;
          }
    }
    this.cargoDatos=true;
}

handleChange(event) {
    this.value = event.detail.value;
    this.valueCombobox = event.detail.value;
}

@wire(getAsesores)
mapearSelect({error, data}){
    console.log(data)
    if (data) {
        const newOptions = data.map(element => ({
            label: element.Name,
            value: element.Id
        }));

        this.options = [...newOptions];
        console.log(this.options);
    }
    else{
        console.log(error);
    }
}

@wire(CurrentPageReference)
currentPageReferenceHandler(currentPageReference) {
    this.currentPageReference = currentPageReference;
}

async addPartner(){
      this.cargoDatos=false;
      this.thankyou=true;
    const lead = {
        FirstName: this.firstname,
        LastName: this.lastname,
        Company : this.company,
        Email : this.email,
        Account__c: ''
    }
    if(this.noVieneAccount){
        lead.Account__c = this.valueCombobox;
    }else{
        lead.Account__c = this.value;
    }
        await agregarLead({lead: lead}).then(res =>{
                console.log(res);
            }).catch(error=>{
                console.log(error);
            })
    
      
}


}