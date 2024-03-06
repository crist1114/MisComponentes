import { LightningElement, track, wire } from 'lwc';

import getProductos from '@salesforce/apex/Product.getProducts';

export default class Productos extends LightningElement {

    @track
    productos = [];

    @wire(getProductos)
    getProductos({error, data}) {
        if(data) {
            this.productos = data;
            console.log(this.productos);
        } else if(error) {
           alert('se ha producido un erro');
        }
    }



}