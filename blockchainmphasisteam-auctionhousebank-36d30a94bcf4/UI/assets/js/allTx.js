$(document).ready(function(){
	var ipAdd=ipAddress();
	var port=portNo();

	var tempLists=[];
	var dataSets=[];

	$.get("http://"+ipAdd+":"+port+"/getAllCustomerTxns", function(response){
		// alert(JSON.stringify(response));
		var index = 1;
		$.each(response, function(i, item) {

			//	alert(JSON.stringify(item));

				//item.timeStamp;
				var timeStamp=item.txList[0].timeStamp;
				var unixtimestamp = timeStamp.toString();
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
				//var txHash=item.transactionHash.toString();
				var txid=item.txList[0].transactionId;
				var blockNumber=item.txList[0].blockNumber;
				


				tempLists.push(index,'<a href="#" data-toggle="tooltip" title='+txid+'>'+txid.substr(0,20)+'...',blockNumber,convdataTime);
				index++;
				dataSets.push(tempLists);
				tempLists=[];

				//alert(dataSet);		               

			
		});

		var table =	$('#allTx').dataTable( {
			//"order": [],
			//aaSorting: [[5, 'desc']],
			data: dataSets,

			columns: [
				{ title: "SNo" },
				{ title: "Tx ID" },
				{ title: "BlockNumber" },
				{ title: "TimeStamp" },
				]
		} );
	} );
});
