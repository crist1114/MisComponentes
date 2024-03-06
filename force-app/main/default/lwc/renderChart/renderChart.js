import { LightningElement, wire } from 'lwc';
import getReports from '@salesforce/apex/Chart.getReports';


export default class RenderChart extends LightningElement {

    reportes = [];

    columns = [
        { label: 'ID', fieldName: 'Id', type: 'text' },
        { label: 'Nombre', fieldName: 'Name', type: 'text' },
        {
          type: 'button',
          typeAttributes: {
            label: 'Ir al Registro',
            name: 'go_to_record',
            title: 'Haz clic para ir al registro',
            value: 'go_to_record',
          },
        },
      ];
    

    @wire(getReports)
    getReports({ error, data }) {
        if (data) {
            this.reportes = data;
            console.log('reportes',this.reportes)
        }
        else
            alert(error);
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
    
        if (action.name === 'go_to_record') {
          // Implementa la lógica para ir al registro, por ejemplo, navegación a una página de detalle
          console.log('Ir al registro:', row.Id);
          // Puedes usar this[NavigationMixin.Navigate] u otras técnicas de navegación aquí
        }
      }
    }