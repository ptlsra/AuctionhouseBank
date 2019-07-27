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

	var assetId = getUrlParameter('assetId');
	$('#assetId').val(assetId);
	
	document.getElementById('offerPlacedTitle').innerHTML="Details For Asset with asset ID: "+assetId;
	document.getElementById('assetIdValue').innerHTML=assetId;
	
	  $.get("http://"+ipAdd+":"+port+"/getAssetDetailsByAssetID?assetId="+assetId, function(response){
			 // alert(JSON.stringify(response));
		  
			var status=response.assetStatus;
				var message=response.message;
				
				message=message.replace(/_/g, ' ');
				
				message=message.charAt(0).toUpperCase() + message.slice(1);
				
				var statusNew=status.replace(/_/g, ' ');
		  document.getElementById('assetName').innerHTML=response.assetName;
		  document.getElementById('offerId').innerHTML=response.offerId;
		  document.getElementById('quantity').innerHTML=response.quantity;
		  document.getElementById('unit').innerHTML=response.units;
		  document.getElementById('status').innerHTML=statusNew;
		  document.getElementById('message').innerHTML=message;
		  
	  });
	  
	
	
});
function goBack() {
    window.history.back();
}