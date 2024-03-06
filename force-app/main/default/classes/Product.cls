public without sharing class Product {

    
    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(){
        try {
            List<Product2> productos = [select name, description from Product2];
            //List<Product2> productos = [select name, precio__c, description from Product2];
            return productos;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}