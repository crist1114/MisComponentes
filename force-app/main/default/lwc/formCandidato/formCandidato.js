import { LightningElement, track, wire} from 'lwc';
import FIRST_NAME from '@salesforce/schema/Lead.FirstName';
import LAST_NAME from '@salesforce/schema/Lead.LastName';
import COMPANY from '@salesforce/schema/Lead.Company';
import objectName from '@salesforce/schema/Lead';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import getAsesores from '@salesforce/apex/FormController.getAsesores';


export default class FormCandidato extends LightningElement {

    // Expose a field to make it available in the template
    fields = [FIRST_NAME,LAST_NAME,COMPANY];

    // Flexipage provides recordId and objectApiName
    objectApiName=objectName;
    @track cargoDatos;
    @track thankyou=false;
    options=[];
    
    @track value;
    @track valueCombobox;
    noVieneAccount;

    @wire(CurrentPageReference)
    currentPageReference;


    @track recordInfo = {
        fields: [
            { name: FIRST_NAME, value: ""},
            { name: LAST_NAME, value: ""},
            { name: COMPANY, value: ""}
        ]
    }

    renderedCallback() {
        this.cargarDatos();
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
        console.log(this.value)
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

    addPartner(){
          this.cargoDatos=false;
          this.thankyou=true;
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Account created',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
}