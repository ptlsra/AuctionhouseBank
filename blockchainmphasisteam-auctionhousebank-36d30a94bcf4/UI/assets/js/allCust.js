$(document).ready(function(){
	var ipAdd=ipAddress();
	var port=portNo();

	var tempLists=[];
	var dataSets=[];

	$.get("http://"+ipAdd+":"+port+"/getAllCustomerDetails", function(response){
		// alert(JSON.stringify(response));
	
		$.each(response, function(i, item) {
		
			
				tempLists.push(i+1,item.firstName+" "+item.lastName,item.emailAddress,item.dob,item.city,item.country,"$"+item.accountBalance);
				
				dataSets.push(tempLists);
				tempLists=[];

				//alert(dataSet);		               

			
		});

		var table =	$('#allCust').dataTable( {
			//"order": [],
			//aaSorting: [[5, 'desc']],
			data: dataSets,

			columns: [
				{ title: "SNo" },
				{ title: "Customer Name" },
				{ title: "Id" },
				{ title: "DOB" },
				{ title: "City" },
				{ title: "Country" },
				{ title: "Balance" },
				]
		} );
	} );
});
