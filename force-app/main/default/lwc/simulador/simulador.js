import { LightningElement,track } from 'lwc';

export default class Simulador extends LightningElement {

    @track income = 0;
    @track projectCost = 0;
    @track paymentTerm = 0;
    @track monthlyPayment = 0;

    handleIncomeChange(event) {
        this.income = parseFloat(event.target.value);
    }

    handleProjectCostChange(event) {
        this.projectCost = parseFloat(event.target.value);
    }

    handlePaymentTermChange(event) {
        this.paymentTerm = parseInt(event.target.value, 10);
    }

    calculateMonthlyPayment() {
        if (this.income <= 0 || this.projectCost <= 0 || this.paymentTerm <= 0) {
            this.monthlyPayment = 0;
        } else {
            const totalPayment = this.projectCost / this.paymentTerm;
            this.monthlyPayment = Math.min(totalPayment).toFixed(2);
        }
    }
}