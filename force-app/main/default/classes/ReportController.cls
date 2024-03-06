public with sharing class ReportController {

   @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunityList()
    {
        return [Select Id, StageName from Opportunity];
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getReportsOnDashboards() {
        List<Map<String, Object>> reportsOnDashboards = new List<Map<String, Object>>();

        // Obtener información sobre los dashboards
        List<Dashboard> dashboards = [SELECT Id, DeveloperName FROM Dashboard where Id='01ZDn000000B3GxMAK'];

        for (Dashboard dashboard : dashboards) {
            Map<String, Object> dashboardInfo = new Map<String, Object>();
            dashboardInfo.put('Id', dashboard.Id);
            dashboardInfo.put('DeveloperName', dashboard.DeveloperName);

            // Obtener información sobre los componentes del dashboard
            List<DashboardComponent> components = [SELECT Id, CustomReportId FROM DashboardComponent WHERE DashboardId = :dashboard.Id LIMIT 5];
            List<Map<String, Object>> componentList = new List<Map<String, Object>>();

            for (DashboardComponent component : components) {
                Map<String, Object> componentInfo = new Map<String, Object>();
                componentInfo.put('Id', component.Id);
                componentInfo.put('CustomReportId', component.CustomReportId);

                // Obtener datos del informe (resultados y metadata)
                if (component.CustomReportId != null) {
                    Reports.ReportResults results = Reports.ReportManager.runReport(component.CustomReportId, true);
                    // System.debug('aqui el resultado del run');
                    // System.debug(results.getFactMap());
                    String factMap = JSON.serialize(results.getFactMap());
                    String groupingDown = JSON.serialize(results.getGroupingsDown());

                    // Obtener los grupos
                    // Reports.GroupingValue[] grupos = results.getGroupingsDown();

                    // // Inicializar una lista para almacenar las filas detalladas
                    // List<Map<String, Object>> filasDetalladas = new List<Map<String, Object>>();

                    // // Iterar sobre cada grupo y obtener las filas
                    // for (Reports.GroupingValue grupo : grupos) {
                    //     Reports.ReportFactWithDetails[] filasGrupo = grupo.getRows();

                    //     // Iterar sobre las filas del grupo y agregar a la lista
                    //     for (Reports.ReportFactWithDetails fila : filasGrupo) {
                    //         Map<String, Object> filaDetallada = new Map<String, Object>(fila.getDataCells());
                    //         filasDetalladas.add(filaDetallada);
                    //     }
                    // }

                    // // Serializar las filas detalladas a formato JSON si es necesario
                    // String filasDetalladasJSON = JSON.serialize(filasDetalladas);

                    // // Guardar las filas detalladas en componentInfo
                    // componentInfo.put('filas', filasDetalladasJSON);


                    String detailColumns = JSON.serialize(results.getReportMetadata().getDetailColumns());
                    //String filas = results.getFactMap();
                    componentInfo.put('factMap', factMap);
                    componentInfo.put('groups', groupingDown);
                    componentInfo.put('columnas', detailColumns);
                }

                componentList.add(componentInfo);
            }
            // System.debug('FILAS');
            // System.debug(componentInfo.get('filas'));
            dashboardInfo.put('Components', componentList);
            reportsOnDashboards.add(dashboardInfo);
        }

        return reportsOnDashboards;
    }
}
