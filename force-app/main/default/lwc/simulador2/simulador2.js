import { LightningElement, track } from 'lwc';

export default class Simulador2 extends LightningElement {

    @track montoDeseado;
    @track plazo;
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
            
            const montoMensual1 = Math.min(this.montoDeseado / this.plazo).toFixed(2);
            const montoMensual2 = Math.min(this.montoDeseado * 0.8 / this.plazo).toFixed(2);
            const montoMensual3 = Math.min(this.montoDeseado * 0.9 / this.plazo).toFixed(2);

            this.opcion1.montoMensual = this.currencyFormatter('COP', montoMensual1);
            this.opcion2.montoMensual = this.currencyFormatter('COP', montoMensual2);
            this.opcion3.montoMensual = this.currencyFormatter('COP', montoMensual3);

        } else {
            this.showOptions = false;
        }
    }

    currencyFormatter(currency, amount) {
       
        return parseFloat(amount).toLocaleString('es-CO', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        });
    }
}