$(document).ready(function(){
	var ipAdd=ipAddress();
	var port=portNo();
	
	 var tempLists=[];
	 var dataSets=[];
	
	
	
		$.get("http://"+ipAdd+":"+port+"/getAllAssets", function(response){
			 
			 // alert(JSON.stringify(response));
	 			$.each(response.records, function(i, item) {
	 				var status=item.assetStatus;
	 				var message=item.message;
	 				var assetId=item.assetId;
	 				//alert(assetId);
	 				$.get("http://"+ipAdd+":"+port+"/getPortValidationDetailsByAssetId?assetId="+assetId, function(responseData){
	 					
	 					
	 					var isValidatedByExporter=responseData.isValidatedByExporter;
	 					var isValidatedByExporterPort=responseData.isValidatedByExporterPort;
	 					var isValidatedByImporter=responseData.isValidatedByImporter;
	 					var isValidated=responseData.isValidated;
	 					
	 					var isValidatedByExporterAtImporterPort=responseData.isValidatedByExporterAtImporterPort;
	 					var isValidatedByImporterPort=responseData.isValidatedByImporterPort;
	 					var isValidatedByImporterAtImporterPort=responseData.isValidatedByImporterAtImporterPort;
	 					var isValidatedImporterPort=responseData.isValidatedImporterPort;
	 					
	 
	 				message=message.replace(/_/g, ' ');
	 				
	 				var statusNew=status.replace(/_/g, ' ');
	 				
	 				if(status=="Asset_Created"){
	 					
	 					tempLists.push(i+1,item.assetId,item.assetLocation,statusNew,'<a href=assetCreated.html?assetId='+item.assetId+'>View Details','');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="Order_Received"){
	 					
	 					tempLists.push(i+1,item.assetId,item.assetLocation,statusNew,'<a href=uploadDocs.html?assetId='+item.assetId+'>'+message,'');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="Ready_To_Ship"){
	 					
	 					tempLists.push(i+1,item.assetId,item.assetLocation,statusNew,'<a href=confirmShipping.html?assetId='+item.assetId+'>Confirm Shipping','');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="Shipped_to_Exporter_Port"){
	 					//ref
	 					tempLists.push(i+1,item.assetId,item.assetLocation,statusNew,'<a href=confirmShippingDone.html?assetId='+item.assetId+'>Pending Arrival','');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="Arrived_at_Exporter_Port"){
	 					//ref
	 					tempLists.push(i+1,item.assetId,item.assetLocation,statusNew,'<a href=confirmShippingDone.html?assetId='+item.assetId+'>Waiting For Bill Of Lading','');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="BillOfLading_Uploaded" &&isValidatedByExporterPort==false){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,statusNew,'<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Validation Pending','');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="BillOfLading_Uploaded" &&isValidatedByExporterPort==true){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,statusNew,'<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From other users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_exp" &&isValidatedByExporterPort==false && (isValidatedByExporter==false || isValidatedByImporter==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by exporter Port','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation ','');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_exp" &&isValidatedByExporterPort==true && (isValidatedByExporter==false || isValidatedByImporter==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by exporter Port','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From other users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_exp" &&isValidatedByExporterPort==true && isValidatedByExporter==true && isValidatedByImporter==true){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by exporter Port','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Final Validation Pending','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 					
	 				
	 				
	 				if(status=="sign_first_deposit_ex" &&isValidatedByExporterPort==false && (isValidatedByExporter==false || isValidatedByImporter==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation ','');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_ex" &&isValidatedByExporterPort==true && (isValidatedByExporter==false || isValidatedByImporter==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From other users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_ex" &&isValidatedByExporterPort==true && isValidatedByExporter==true && isValidatedByImporter==true){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Final Validation Pending','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				if(status=="sign_first_deposit_im" &&isValidatedByExporterPort==false && (isValidatedByExporter==false || isValidatedByImporter==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by importer ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Validation Pending ','');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_im" &&isValidatedByExporterPort==true && (isValidatedByExporter==false || isValidatedByImporter==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by importer ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From other users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_first_deposit_im" &&isValidatedByExporterPort==true && isValidatedByExporter==true && isValidatedByImporter==true){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Bill of Lading validated by importer ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Final Validation Pending','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 					
	 					
	 				
	 				
	 				// final validation completed at exporter Port
	 				
	 				if(status=="validated_at_exporter_port"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Final Validation Complete at Exporter Port ','<a href=validateBillOfLadingDone.html.html?assetId='+item.assetId+'>Pending Arrival at Importer Port','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				// final validation completed at importer Port
	 				
	 				// open for validation 
	 				if(status=="Arrived_at_Importer_Port" && isValidatedByImporterPort==false){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Arrived at Importer Port ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation at Importer Port','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				if(status=="sign_second_deposit_imp" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==false || isValidatedByExporterAtImporterPort==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer Port ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From Other Users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_imp" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==true && isValidatedByExporterAtImporterPort==true)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer Port ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Final Validation Pending','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterPort==false){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From Other Users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==false || isValidatedByExporterAtImporterPort==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From Other Users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_ex" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==true && isValidatedByExporterAtImporterPort==true)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Exporter ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Final Validation Pending','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				if(status=="sign_second_deposit_im" && isValidatedByImporterPort==false){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer  ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From Other Users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_im" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==false || isValidatedByExporterAtImporterPort==false)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer  ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Pending Validation From Other Users','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="sign_second_deposit_im" && isValidatedByImporterPort==true && (isValidatedByImporterAtImporterPort==true && isValidatedByExporterAtImporterPort==true)){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Document validated at Importer  ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Final Validation Pending','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				
	 				// shipping to importer port
	 				
	 				
	 				if(status=="validated_at_importer_port"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Final Validation Recieved  ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Shipping to Importer','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				if(status=="Arrived_at_Importer"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Asset Arrived at Importer  ','<a href=validateBillOfLadingDone.html?assetId='+item.assetId+'>Waiting For Goods Recieved Docs','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				// diff
	 				if(status=="goodsReceived_Uploaded"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Goods Recieved Document Uploaded  ','<a href=goodsDocs.html?assetId='+item.assetId+'>Final Validation Pending From Importer','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				if(status=="delivered"){
	 					//ref
	 					

	 					tempLists.push(i+1,item.assetId,item.assetLocation,'Final Validation Complete  ','<a href=goodsDocs.html?assetId='+item.assetId+'>Asset Delivered','');

							dataSets.push(tempLists);
							tempLists=[];
	 				}
	 				
	 				
	 				
	 				});
	 				
	 				
	 					//alert(dataSet);		               
	 			});
 				setTimeout(function(){

	 			$('#allAssets').dataTable( {
					data: dataSets,
					columns: [
					    { title: "SNo" },
					    { title: "Asset ID" },
					    { title: "Location" },
					    { title: "Status" },
					    { title: "Message" },
					    { title: "Action" },
					    
					    
					    
					    
					    

					  
					]
		    		} );
	 			
	 			},2500);
	 			
		});
		
	 			
	 			
		
	 
});
      