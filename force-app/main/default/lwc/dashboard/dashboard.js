import { LightningElement,wire } from 'lwc';
// import getOpportunityList from '@salesforce/apex/ReportController.getOpportunityList';
import getReportsOnDashboards from '@salesforce/apex/ReportController.getReportsOnDashboards';
import { NavigationMixin } from 'lightning/navigation';



export default class Dashboard extends NavigationMixin(LightningElement) {

    oppBarconfig;
    oppPieconfig;
    oppDoughnutConfig;
    oppPolarAreaConfig;
    oppBubbleConfig;
    oppLineConfig;

    columns = [];
    dataColumns = [];

    canBarConfig;
    verReporte;
    reporteId;
    reportUrl;

    mapChartBackgroundColor = new Map();

      connectedCallback() {
        this.mapChartBackgroundColor.set(0, 'rgb(255, 99, 132)');//red
        this.mapChartBackgroundColor.set(1, 'rgb(255, 205, 86)');//yellow
        this.mapChartBackgroundColor.set(2, 'rgb(3, 145, 15)');//green
        this.mapChartBackgroundColor.set(3, 'rgb(54, 162, 235)');//blue
        this.mapChartBackgroundColor.set(4, 'rgb(235, 111, 54)');//orange
        this.mapChartBackgroundColor.set(5, 'rgb(75, 192, 192)');//lightgreen
        this.mapChartBackgroundColor.set(6, 'rgb(163, 75, 192)');//purple
    }

    handleClickReporte(){
        this.verReporte = true;
        //this.reportUrl = '/apex/MyReportPage?id=' + this.reporteId;
        this.reportUrl = '/bmi/s/report/' + this.reporteId;
        // const iframe = this.template.querySelector('iframe');
        // const elementoDeseado = iframe.contentDocument.getElementById('.slds-container--fluid');
        // if (elementoDeseado) {
        //     alert('a borrar')
        //     // Lógica para manipular o eliminar el elemento.
        //     elementoDeseado.parentNode.removeChild(elementoDeseado);
        //   }

    }

    // handleClickReporte(evt){
    //     this.verReporte = true;
    //         evt.preventDefault();
    //         evt.stopPropagation();
    //         this[NavigationMixin.Navigate]({
    //             type: 'standard__webPage',
    //             attributes: {
    //                 recordId: '001Dn00000jBszgIAC',
    //                 objectApiName: 'Account',
    //                 actionName: 'view',
    //                 url: 'https://ceiba2-dev-ed.develop.my.site.com/s/?tabset-dcb65=3'
    //             }
    //         });
        
    // }

    crearColumnas(columnas){
        columnas.forEach(item => {
            this.columns.push({ label: item, fieldName: 'item', type: 'url' }); 
        });
    }

    @wire(getReportsOnDashboards) 
    getReportsdash({error, data}){
        if(data){

            //components 0 es candidatos por estado de contratacion
            //factMap contiene las rows, groupingsDown.groupings[].label contiene el nombre del grupo
            const factMapObject = JSON.parse(data[0].Components[0].factMap);
            this.reporteId = data[0].Components[0].CustomReportId;
            
            console.log('DATA');
            console.log(data);
            //lo convierto en array
            const factMap = Object.values(factMapObject).map(obj => ({ factMap: obj }));

            const groups = JSON.parse(data[0].Components[0].groups);  // .groupings contiene los labels

            const columnas = JSON.parse(data[0].Components[0].columnas);

            //creo las columnas
            this.crearColumnas(columnas);

            const infoPorColumna = factMap[1].factMap.rows;  //cada factmap es un grupo de filas
            console.log('fact');
            console.log(infoPorColumna);
            let contColumna = 0;

            //lleno el data columns
            infoPorColumna.forEach(item => {
                const dataCell = item.dataCells;
                const nuevoElemento = {};

                dataCell.forEach(fila => {
                    
                    nuevoElemento[columnas[contColumna]] = fila.label;
                    contColumna++;
                });
                contColumna=0;
                this.dataColumns.push(nuevoElemento);
                console.log('FILA');
                console.log(this.dataColumns);
            });

            //armo el grafico
            let cantidadDeRegistrosPorFila = factMap; //[{key, agregates, rows},{}...] 
            let labels = groups.groupings;

            let listaCandidatosLabels = [];
            let listaCandidatosEstadoContador = [];
            let listaDeColorDeFondo = [];

            let m = 1; //inicio en 1 por que la pos 0 de las filas no tiene nada
            let bgColor = this.mapChartBackgroundColor;

            labels.forEach((item)=> {
                listaCandidatosLabels.push(item.label);
                listaCandidatosEstadoContador.push(cantidadDeRegistrosPorFila[m].factMap.rows.length);
                listaDeColorDeFondo.push(bgColor.get(m));
                m++;
            });

            this.canBarConfig = {
                type: "bar",
                data: {
                    labels: listaCandidatosLabels,
                    datasets: [{
                        label: 'Candidatos',
                        data: listaCandidatosEstadoContador,
                        backgroundColor: listaDeColorDeFondo,
                        borderColor: listaDeColorDeFondo,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                },
            };

        }
        else{
            console.log(error);
        }
    }

    // // @wire(getOpportunityList)
    // // wiredOpprtunityList({ error, data }) {
    // //     if(data)
    // //     {

    // //         let listOfOppStatus = [];
    // //         let listOfOppStatusDataCount = [];
    // //         let listOfBackgroundColor = [];

    // //         let mapOppData = new Map();


    // //          for (let i = 0; i < data.length; i++) {
    // //             if (!mapOppData.has(data[i].StageName)) {
    // //                 mapOppData.set(data[i].StageName, 1);
    // //             }
    // //             else {
    // //                 mapOppData.set(data[i].StageName, mapOppData.get(data[i].StageName) + 1);
    // //             }
    // //         }
    // //         console.log('mapData ',mapOppData);
    // //         let m = 0;
    // //         let bgColor = this.mapChartBackgroundColor;

    // //         mapOppData.forEach(function (value, key) {
    // //             console.log('Key -> ' + key + '  value -> ' + value);
    // //             listOfOppStatus.push(key);
    // //             listOfOppStatusDataCount.push(mapOppData.get(key));
            
    // //             listOfBackgroundColor.push(bgColor.get(m));
    // //             m++;
    // //         });
    // //         console.log('valores');
    // //         console.log(listOfOppStatusDataCount);

    // //         if (listOfOppStatusDataCount.length > 0) {
    // //             this.oppBarconfig = {
    // //                 type: "bar",
    // //                 data: {
    // //                     labels: listOfOppStatus,
    // //                     datasets: [{
    // //                         label: 'Opportunity',
    // //                         data: listOfOppStatusDataCount,
    // //                         backgroundColor: listOfBackgroundColor,
    // //                         borderColor: listOfBackgroundColor,
    // //                         borderWidth: 1
    // //                     }]
    // //                 },
    // //                 options: {
    // //                     scales: {
    // //                         y: {
    // //                             beginAtZero: true
    // //                         }
    // //                     }
    // //                 },
    // //             };
                
    // //             this.oppPieconfig = {
    // //                 type: "pie",
    // //                 data: {
    // //                     labels: listOfOppStatus,
    // //                     datasets: [{
    // //                         label: 'Opportunity',
    // //                         data: listOfOppStatusDataCount,
    // //                         backgroundColor: listOfBackgroundColor,
    // //                         borderColor: listOfBackgroundColor,
    // //                         borderWidth: 1
    // //                     }]
    // //                 },
    // //                 options: {
    // //                     scales: {
    // //                         y: {
    // //                             beginAtZero: true
    // //                         }
    // //                     }
    // //                 },
    // //             };                
    // //             this.oppDoughnutConfig = {
    // //                 type: "doughnut",
    // //                 data: {
    // //                     labels: listOfOppStatus,
    // //                     datasets: [{
    // //                         label: 'Opportunity',
    // //                         data: listOfOppStatusDataCount,
    // //                         backgroundColor: listOfBackgroundColor,
    // //                         borderColor: listOfBackgroundColor,
    // //                         borderWidth: 1
    // //                     }]
    // //                 },
    // //                 options: {
    // //                     scales: {
    // //                         y: {
    // //                             beginAtZero: true
    // //                         }
    // //                     }
    // //                 },
    // //             };
    // //             this.oppPolarAreaConfig = {
    // //                 type: "polarArea",
    // //                 data: {
    // //                     labels: listOfOppStatus,
    // //                     datasets: [{
    // //                         label: 'Opportunity',
    // //                         data: listOfOppStatusDataCount,
    // //                         backgroundColor: listOfBackgroundColor,
    // //                         borderColor: listOfBackgroundColor,
    // //                         borderWidth: 1
    // //                     }]
    // //                 },
    // //                 options: {
    // //                     scales: {
    // //                         y: {
    // //                             beginAtZero: true
    // //                         }
    // //                     }
    // //                 },
    // //             };
    // //              this.oppBubbleConfig = {
    // //                 type: "bubble",
    // //                 data: {
    // //                     labels: listOfOppStatus,
    // //                     datasets: [{
    // //                         label: 'Opportunity',
    // //                         data: listOfOppStatusDataCount,
    // //                         backgroundColor: listOfBackgroundColor,
    // //                         borderColor: listOfBackgroundColor,
    // //                         borderWidth: 1
    // //                     }]
    // //                 },
    // //                 options: {
    // //                     scales: {
    // //                         y: {
    // //                             beginAtZero: true
    // //                         }
    // //                     }
    // //                 },
    // //             };
    // //              this.oppLineConfig = {
    // //                 type: "line",
    // //                 data: {
    // //                     labels: listOfOppStatus,
    // //                     datasets: [{
    // //                         label: 'Opportunity',
    // //                         data: listOfOppStatusDataCount,
    // //                         backgroundColor: listOfBackgroundColor,
    // //                         borderColor: listOfBackgroundColor,
    // //                         borderWidth: 1
    // //                     }]
    // //                 },
    // //                 options: {
    // //                     scales: {
    // //                         y: {
    // //                             beginAtZero: true
    // //                         }
    // //                     }
    // //                 },
    // //             };
                
    // //             }
          
            
    // //     } 
    // //         else if (error) {
    // //         console.log(error);
    // //     }
    // }


    

}