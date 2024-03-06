public with sharing class Chart {
    
    @AuraEnabled(cacheable=true)
    public static List<Report> getReports(){
        try {
            List<Report> reportes = [SELECT Id, Description, Name, DeveloperName FROM Report];
            return reportes;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}