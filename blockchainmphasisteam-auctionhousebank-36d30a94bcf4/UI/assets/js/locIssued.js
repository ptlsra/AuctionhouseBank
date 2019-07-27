$(document).ready(function(){
	var ipAdd=ipAddress();
	var port=portNo();

	var ipfsIpAdd=ipfsIpAddress();
	var ipfsPort=ipfsPortNo();

//	alert($("#importerName").val());
	$('#agreementID').hide();
	$('#importerBankName').hide();
	
	var getUrlParameter = function getUrlParameter(sParam) {
	    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;

	    for (i = 0; i < sURLVariables.length; i++) {
	        sParameterName = sURLVariables[i].split('=');

	        if (sParameterName[0] === sParam) {
	            return sParameterName[1] === undefined ? true : sParameterName[1];
	        }
	    }
	};

	var offerId = getUrlParameter('offerId');
	var agreementId = getUrlParameter('agreementId');
	$("#agreementID").val(agreementId);
	var importerName=localStorage.getItem('importerBankName');
	
	$("#importerBankName").val(importerName);
	
	// balance Details
	var importerBank=localStorage.getItem('importerBank');
	 $.get("http://"+ipAdd+":"+port+"/getBalance?ownerAddress="+importerBank, function(responseDataNewValueTwo){
			
		  document.getElementById('currentBalance').innerHTML=responseDataNewValueTwo.balance;
	 
		 
	  });
	
	document.getElementById('offerPlacedTitle').innerHTML="Details For Agreement with Agreement ID: "+agreementId;
	document.getElementById('offerIdValue').innerHTML=agreementId;
	 $.get("http://"+ipAdd+":"+port+"/getOffer?offerId="+offerId, function(response){
		  $.get("http://"+ipAdd+":"+port+"/getOfferEntitiesCity?offerId="+offerId, function(responseDataCity){

		 // alert(JSON.stringify(response));
	  document.getElementById('price').innerHTML=response.price;
	  document.getElementById('assetName').innerHTML=response.assetName;
	  document.getElementById('assetDescription').innerHTML=response.assetDescription;
	  document.getElementById('quantity').innerHTML=response.quantity;
	  document.getElementById('unit').innerHTML=response.unit;
	  document.getElementById('createdBy').innerHTML=response.exporter+' / '+responseDataCity.exporterCity;
	  
  });
	 });
  
  $.get("http://"+ipAdd+":"+port+"/getOfferEntities?offerId="+offerId, function(responseData){
	  
	  $.get("http://"+ipAdd+":"+port+"/getOfferEntitiesCity?offerId="+offerId, function(responseDataCity){
		 // alert(JSON.stringify(response));
	  document.getElementById('exporterBankName').innerHTML=responseData.exporterBankName;
	  document.getElementById('exporterPortName').innerHTML=responseData.exporterPortName+' / '+responseDataCity.exporterPortCity;
	  document.getElementById('importerNameValue').innerHTML=responseData.importerName +' / '+responseDataCity.importerCity;
	  document.getElementById('importerBankNameValue').innerHTML=responseData.importerBankName;
	  document.getElementById('importerPortName').innerHTML=responseData.importerPortName+' / '+responseDataCity.importerPortCity;

	  
	  var unixtimestamp = responseData.deliveryDate.toString().slice(0,-3);

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
	  
		 
		 document.getElementById('deliveryDate').innerHTML=convdataTime;
  });
  });
  
  $.get("http://"+ipAdd+":"+port+"/getOfferDetails?offerId="+offerId, function(response2){
		 // alert(JSON.stringify(response));
	  var timeValue=response2.createdAt.toString();
		
		 var unixtimestamp = timeValue.slice(0,-9);

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
	  
		 document.getElementById('createdAt').innerHTML=convdataTime;
	 
	  
  });
  
  
  
  
  
  $.get("http://"+ipAdd+":"+port+"/getSalesAgreementDetails?agreementId="+agreementId, function(responseDataValue){
		 

	     $('#btnShow').click(function(){
	        		
	        		
	        	
	            $("#dialog").dialog({
	               
	                    maxWidth:600,
	                    maxHeight: 450,
	                    width: 600,
	                    height: 450,
	                    modal: true
	                    
	                });
	    $("#frame").attr("src", "http://"+ipfsIpAdd+":"+ipfsPort+"/ipfs/"+responseDataValue.agreementDocument);
	        
	        });
	     
	     $('#btnShow2').click(function(){
     		
     		
	        	
	            $("#dialog2").dialog({
	               
	                    maxWidth:600,
	                    maxHeight: 450,
	                    width: 600,
	                    height: 450,
	                    modal: true
	                    
	                });
	    $("#frame2").attr("src", "http://"+ipfsIpAdd+":"+ipfsPort+"/ipfs/"+responseDataValue.locDocument);
	        
	        });
	     
	  
		 
		 
	 
});
	        
	  



});

function goBack() {
window.history.back();
}


