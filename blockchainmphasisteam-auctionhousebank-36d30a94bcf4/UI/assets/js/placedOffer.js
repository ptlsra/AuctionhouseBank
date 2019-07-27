$(document).ready(function(){
	var ipAdd=ipAddress();
	var port=portNo();
	
	

	
	
	
	
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
	
	
	document.getElementById('offerPlacedTitle').innerHTML="Details For Offer with Offer ID: "+offerId;
	document.getElementById('offerIdValue').innerHTML=offerId;
	
	  $.get("http://"+ipAdd+":"+port+"/getOffer?offerId="+offerId, function(response){
			 // alert(JSON.stringify(response));
		  document.getElementById('price').innerHTML=response.price;
		  document.getElementById('assetName').innerHTML=response.assetName;
		  document.getElementById('assetDescription').innerHTML=response.assetDescription;
		  document.getElementById('quantity').innerHTML=response.quantity;
		  document.getElementById('unit').innerHTML=response.unit;
		  
	  });
	  
	  $.get("http://"+ipAdd+":"+port+"/getOfferDetails?offerId="+offerId, function(response2){
			 // alert(JSON.stringify(response));
		  var timeValue=response2.deliveryDate.toString();
		  $('#deliveryDateDetail').val(timeValue);
			 var unixtimestamp = timeValue.slice(0,-3);

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
			
			 document.getElementById('buyerDetails').innerHTML=response2.buyer.substr(0,20)+'...';
			 
		 
		  
	  });
	
// Agreement Details
 // Agreement Details
	  
	  
	  $.get("http://"+ipAdd+":"+port+"/getSalesAgreement?offerId="+offerId, function(responseData){
			 
		
		  var agreementStatus=responseData.agreementStatus;
		  document.getElementById('agreementStatus').innerHTML=agreementStatus;
		  
		 
			 
		 
		  
	  });
	  
	  $.get("http://"+ipAdd+":"+port+"/getBankDetailsByOfferId?offerId="+offerId, function(responseData){
			 
		  var exporterBank=responseData.exporterBankName.toString();
		  document.getElementById('exporterBankAddress').innerHTML=exporterBank;
		 
		
		  
		 
			 
		 
		  
	  });
	  
	  $.get("http://"+ipAdd+":"+port+"/getTradersFromAgreement?offerId="+offerId, function(responseDataValue){
			 
		  var exporterPortName=responseDataValue.exporterPortName.toString();
		  document.getElementById('exporterPort').innerHTML=exporterPortName;
		 
		  document.getElementById('buyerDetails').innerHTML=responseDataValue.importerName;
		 
		  
	  });
	
	
});

function goBack() {
    window.history.back();
}