$(document).ready(function(){
	var ipAdd=ipAddress();
	var port=portNo();

		 var tempLists=[];
		 var dataSets=[];
		
		// alert(ipAdd);
		  $.get("http://"+ipAdd+":"+port+"/getAllAgreements", function(response){

	 			$.each(response.records, function(i, item) {
	 				var agreementMessage=item.agreementMessage
	 				
	$.get("http://"+ipAdd+":"+port+"/getOfferDetails?offerId="+item.offerId, function(responseData){
	 					
	 					$.get("http://"+ipAdd+":"+port+"/getOffer?offerId="+item.offerId, function(responseDataNew){
	 				
	 						$.get("http://"+ipAdd+":"+port+"/getOfferEntities?offerId="+item.offerId, function(responseDataVale){
	 						var assetName=responseDataNew.assetName;
	 						var quantity=responseDataNew.quantity+' '+responseDataNew.unit;
	 						var createdBy=responseDataNew.exporter;
	 						var exporterBank=responseDataVale.exporterBankName;
	 						
	 						var buyer=responseDataVale.importerName;
	 				var unixtimestamp = responseData.createdAt.toString().slice(0,-9);
					//var unixtimestamp = item.timeStamp;
					// Months array
					var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

					// Convert timestamp to milliseconds
					var date = new Date(unixtimestamp*1000);

					// Year
					var year = date.getFullYear();

					// Month
					var month = months_arr[date.getMonth()];

					// Day
					var day = date.getDate();

					// Hours
					var hours = date.getHours();

					// Minutes
					var minutes = "0" + date.getMinutes();

					// Seconds
					var seconds = "0" + date.getSeconds();

					// Display date time in MM-dd-yyyy h:m:s format
					var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
	 			

	 				if(agreementMessage=="VPFI"){
	 					var statusValue="Agreement_Approval_Pending_From_Importer";
	 					tempLists.push(i+1,item.agreementId,createdBy,buyer,exporterBank,'<a href=offerAcceptedStatic.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'&status='+statusValue+'>Agreement Created.Pending Importer Validation.','','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(agreementMessage=="WFLOC"){
	 					var statusValue="Pending_LOC_Draft_Approval_From_Exporter."
	 					tempLists.push(i+1,item.agreementId,createdBy,buyer,exporterBank,'<a href=contractAcceptedNew.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'&status='+statusValue+'>Pending LOC Draft Approval By Exporter','','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(agreementMessage=="LDVE"){
	 					var statusValue="Waiting_For_LOC_from_Importer_Bank"

		 					tempLists.push(i+1,item.agreementId,createdBy,buyer,exporterBank,'LOC Draft Approved By Exporter','<a href=contractAccepted.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'&status='+statusValue+'>Upload LOC','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				if(agreementMessage=="VPFEB"){
	 					var statusValue="Pending_LOC_Validation_from_Exporter_Bank";
	 					tempLists.push(i+1,item.agreementId,createdBy,buyer,exporterBank,'<a href=locIssued.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'&status='+statusValue+'>LOC Issued','','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 				if(agreementMessage=="RTT"){
	 					var statusValue="LOC_Issued";
	 					tempLists.push(i+1,item.agreementId,createdBy,buyer,exporterBank,'<a href=offerReady.html?offerId='+item.offerId+'&agreementId='+item.agreementId+'&status='+statusValue+'>LOC Issued','','<a href=agreementHistory.html?agreement='+item.agreementId+'&offerId='+item.offerId+'>View History');

						dataSets.push(tempLists);
						tempLists=[];
	 				}
	 				
	 			
	 						 } );
	 					  } );
	 					  });
					//alert(dataSet);		               
					 			        	
				});
					//$('#res').dataTable();

			//alert(dataSet);
	 					setTimeout(function(){
			$('#allAgreement').DataTable( {
				data: dataSets,
				columns: [
				    { title: "SNo" },
				    { title: "Request ID" },
				  
				    { title: "Seller" },
				    { title: "Buyer" },
				    { title: "Exporter Bank" },
				    { title: "Status" },
				    { title: "Action" },
				    { title: "History" }
				    
				    
				    
				    
				    

				  
				]
	    		} );
	 					},2000);
	        } );
	 		
//	}
	
		 
});


      