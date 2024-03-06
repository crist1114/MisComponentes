import { LightningElement, track } from 'lwc';

export default class Simulador2 extends LightningElement {

    @track montoDeseado = 0;
    @track plazo = 0;
    @track showOptions = false;
    @track opcion1 = { montoMensual: 0 };
    @track opcion2 = { montoMensual: 0 };
    @track opcion3 = { montoMensual: 0 };

    handleMontoChange(event) {
        this.montoDeseado = event.target.value;
        this.calcularOpciones();
    }

    handlePlazoChange(event) {
        this.plazo = event.target.value;
        
    }

    calcularOpciones() {
        if (this.montoDeseado > 0 && this.plazo > 0) {
            this.showOptions = true;
            

            this.opcion1.montoMensual = Math.min(this.montoDeseado/this.plazo).toFixed(2);
            this.opcion2.montoMensual = Math.min(this.montoDeseado*0.8/this.plazo).toFixed(2);
            this.opcion3.montoMensual = Math.min(this.montoDeseado*0.9/this.plazo).toFixed(2);
        } else {
            this.showOptions = false;
        }
    }
}