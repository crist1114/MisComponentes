public without sharing class FormController {

    
    
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAsesores(){
        try {
            List<RecordType> r = [select id from recordtype where developername='Consultant' limit 1];
            String idRecordType = r[0].id;
            System.debug(idRecordType);
            List<Account> accounts = [select id, name from account where recordtypeid=:idRecordType];
            System.debug(accounts);
            return accounts;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string agregarLead(Lead lead){
        try {
            insert lead;
            return 'todo bien';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}