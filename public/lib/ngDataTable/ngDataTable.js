var app=angular.module("ngDataTable",[]);

app.directive('jdatatable',function($compile,$window,$filter){
	return{
		restrict:'E',
		scope:{
			jsonData:'=jsondata',
			dataModel:'=datamodel',
			editRow:'&editrow',
			deleteRow:'&deleterow',
			gridFinish:'&gridcomplete',
			addRow:'&addrow',
			updateRow:'&update',
			clickRow:'&rowclick',
			staticols:'@staticcolumn',
			defaultsort:'=defaultsort',
			complexHeader:'@complexheader',
			groupheader:'=grouphead',
			checkedfunction:'&check'
		},
	//Template for table
	
		template:'<div id="recentClaims" class="responsivetbl" staticolumn complex="complexHeader" group="groupheader" staticvalue="staticols" datamodel="dataModel">'+
		'<div class="tblcontainer" >'+
			'<table class="table table-bordered table-striped table-hover dataTable">'+
				'<thead>'+
				
				'</thead>'+
				'<tbody >'+
										   
				'</tbody>'+
										   
			'</table>'+
			'<div class="noRecords errorpara clearfix"><p>No Records Found</p></div>'+
		'</div>'+
		'</div>',
		link:function(scope,element,attrs){	
		//Initialising variables
			scope.rowIndex="";
			scope.checked_data;	//root scope data variable for checked data
			scope.checked_data_checkbox=[];	//root scope data 
			scope.checked_status=[];//for finding selected row
			scope.previoustime=0;//setting before grid finish event
			scope.flagForRowClick=0;//setting flag when row click
			scope.checked_Class='selected';//applying class on checking row
			scope.sorted_Class="sorted"; //applying class on sort
			scope.pagination_button_disabled_Class="disabled"; //applying class on disabling pagination button
			scope.dataLength=scope.jsonData.length;
		
		for(i=0;i<scope.dataModel.length;i++)
		{
			if(scope.dataModel[i].check!=undefined){
				var input_type=scope.dataModel[i].type;//type of input
			}		
		}
		
		
	
			if(scope.dataModel[0].check!=undefined && scope.staticols!=undefined){
				scope.staticols=1;
			}
			
				//when default sort is declared this function will be executed
		scope.defaultsorting=function(){
			if(scope.defaultsort!=undefined){
				var index=scope.defaultsort[0];
				var asc;
				if(scope.defaultsort[1]=="Asc"||scope.defaultsort[1]=="asc"){
					asc=false;
				}else{
					if(scope.defaultsort[1]=="Desc"||scope.defaultsort[1]=="desc"){
					asc=true;
					}
				}
				if(asc!=undefined){
					var object=scope.sortingjsonObject(scope.jsonData,scope.dataModel[index].sort,scope.dataModel[index].map,asc);
					scope.jsonData=object;
				}
			}
		}
		
			//creating an header
			if(scope.complexHeader=="false"){//non-complex header function
			scope.tableheader = '<tr>';	
				for (k = 0; k < scope.dataModel.length; k++) {
				var show = (typeof scope.dataModel[k].show != 'undefined') ? true : false;
					if (!show) {
						tdwidths = (typeof scope.dataModel[k].width != 'undefined') ? "width=" + scope.dataModel[k].width + "%" : '';
						titles = (typeof scope.dataModel[k].titles != '') ? scope.dataModel[k].titles : '&nbsp;';
						sort = (typeof scope.dataModel[k].sort != 'undefined') ? 'data-sort="' + scope.dataModel[k].sort + '"' : 'data-sort="none"';
						map = (typeof scope.dataModel[k].map != 'undefined') ? scope.dataModel[k].map : '';
						scope.tableheader += '<th data-by="' + map + '" tabindex="0"  ' + sort + ' ' + tdwidths + ' data-col="' + k + '" ng-click="sort(dataModel['+ k +'].map,dataModel['+ k +'].sort,$event)" >' + titles + '</th>';
					}
				}
			scope.tableheader += '</tr>';
			}else{//for complex header function
				var row1 = "",
					row2 = "";
				row1 += '<tr>';
				row2 += '<tr>';
				for (var i = 0; i < scope.dataModel.length; i++) {
					show = (typeof scope.dataModel[i].show != 'undefined') ? true : false;
					if (!show) {
						tdwidths = (typeof scope.dataModel[i].width != 'undefined') ? "width=" + scope.dataModel[i].width + "%" : '';
						titles = (typeof scope.dataModel[i].titles != '') ? scope.dataModel[i].titles : '&nbsp;';
						sort = (typeof scope.dataModel[i].sort != 'undefined') ? 'data-sort="' + scope.dataModel[i].sort + '"' : 'data-sort="none"';
						map = (typeof scope.dataModel[i].map != 'undefined') ? scope.dataModel[i].map : '';
						halign = (typeof scope.dataModel[i].headAlign != 'undefined') ? 'align="' + scope.dataModel[i].headAlign + '"' : '';
						var count = 0,
							titleValue;
						for (var j = 0; j < scope.groupheader.length; j++) {
							if (scope.dataModel[i].map == scope.groupheader[j].startColumnName) {
								count++;
								titleValue = j;
							}
						}
						if (count == 1) {
							row1 += '<th colSpan="' + scope.groupheader[titleValue].numberOfColumns + '" data-by="' + map + '" data-sort="none" tabindex="0" ' + tdwidths + ' align="center">' + scope.groupheader[titleValue].titleText + '</th>';
							for (k = 0; k < scope.groupheader[titleValue].numberOfColumns; k++) {
								row2 += '<th data-by="' + map + '" tabindex="0"  ' + sort + ' ' + tdwidths + ' data-col="' + i + '" ng-click="sort(dataModel['+ i +'].map,dataModel['+ i +'].sort,$event)" >' + scope.dataModel[i].titles + '</th>';
									i++;
							}
							i--;
						} else {
							row1 += '<th rowSpan="2" data-by="' + map + '" tabindex="0"  ' + sort + ' ' + tdwidths + ' data-col="' + i + '" ng-click="sort(dataModel['+ i +'].map,dataModel['+ i +'].sort,$event)">' + scope.dataModel[i].titles + '</th>';						
						}
					}
				}
				row1 += '</tr>';
				row2 += '</tr>';
				scope.tableheader = row1 + row2;
			};
		
			//for display th
			if(scope.complexHeader=="true"){			
				var noOfStaticCols=scope.staticols;
				for(var i=0;i<scope.groupheader.length;i++){
					for(var j=0;j<scope.staticols;j++){				
						if(scope.groupheader[i].startColumnName==scope.dataModel[j].map){
							noOfStaticCols=scope.staticols-1;
							if(scope.groupheader[0].numberOfColumns>2){
								noOfStaticCols=j;
							}				
						}				
					}
				}
				scope.staticols=noOfStaticCols;
			}
			scope.showth=function(row){
				var rowIndex=scope.dataModel.indexOf(row);
				if(rowIndex>=0){
					return true;
				}else{
					return false;
				}
			};

			//This function sorts the json object according to column selection	
			scope.sortingjsonObject=function(RecentClaims,type,prop,asc){ 
                var data =RecentClaims;
				var priority = { "LOW": 1, "MEDIUM": 2, "HIGH": 3 };
				data.sort(function (a, b) {
                    if (!asc) {
                        if (type === 'number') {
                            return a[prop] - b[prop];
                        } else if (type == 'date') {
                            return new Date(a[prop]).getTime() - new Date(b[prop]).getTime();
                        }else if (type === 'priority'){
						return priority[a[prop].toString()] - priority[b[prop].toString()];
						}else {
                            return scope.alphanum(a[prop],b[prop]);
                        }
                    } else {
                        if (type === 'number') {
                            return b[prop] - a[prop];
                        } else if (type == 'date') {
                            return new Date(b[prop]).getTime() - new Date(a[prop]).getTime();
                        } else if (type === 'priority'){
						return priority[b[prop].toString()] - priority[a[prop].toString()];
					} else {
                            return scope.alphanum(b[prop],a[prop]);
                        }
                    }

                });
				return data;		
			};
			
			//This function is called for sorting the chunk values in the column
						 scope.alphanum = function(a, b) {
  function chunkify(t) {
    var tz = new Array();
    var x = 0, y = -1, n = 0, i, j;
	if((t == null)||(t == undefined)) t="";
    while (i = (j = t.charAt(x++)).charCodeAt(0)) {
      var m = (i == 46 || (i >=48 && i <= 57));
      if (m !== n) {
        tz[++y] = "";
        n = m;
      }
      tz[y] += j;
    }
    return tz;
  }

  var aa = chunkify(a);
  var bb = chunkify(b);

  for (var x = 0; aa[x] && bb[x]; x++) {
    if (aa[x] !== bb[x]) {
      var c = Number(aa[x]), d = Number(bb[x]);
      if (c == aa[x] && d == bb[x]) {
        return c - d;
      } else return (aa[x] > bb[x]) ? 1 : -1;
    }
  }
  return aa.length - bb.length;
}
			
				scope.sortByValue="";
				
		//This function is called for sorting the table on clicking column header
			scope.sortedorder=false;//assigning default order as ascending which is given as false
			var oldSortedValue=null;
			var intialscope=scope.checkedAll;
			scope.sort=function(colHeading,sorttype,event){
				if(sorttype!=undefined){//avoiding deafault sorting
				if(colHeading!=undefined){
				element.find('thead tr th').attr("data-asc","");//removing data-asc attribute
					scope.sortByValue=colHeading;
					if(oldSortedValue == colHeading){
						oldSortedValue=null;
						scope.sortedorder=true;	
					}else{
						oldSortedValue = colHeading;
						scope.sortedorder=false;
						$(event.target).attr("data-asc","A");//
						var thindex=element.find(event.target).index();
						// if(scope.staticols-1>=thindex){
						// element.find('.staticCol table thead th:eq('+thindex+')').attr("data-asc","A");
						// element.find('.tblcontainer table thead th:eq('+thindex+')').attr("data-asc","A");
						// }
					}
					var object=scope.sortingjsonObject(scope.jsonData,sorttype,colHeading,scope.sortedorder);
					scope.jsonData=object;
					scope.first();
			}
				}		
			}
scope.deleted_data=1;
			//html code for tablebody		
			scope.tablebody='<tr active="true"  ng-repeat="row in filtered=(jsonData)| startFrom:currentPage*pageSize | limitTo:pageSize" ng-click="rowClick(row)"  ng-class="checkStyle($index,row)"><td ng-repeat="columns in dataModel" ng-if="columns.show!=false?true:false" ng-class="ColStyle($parent.$parent.$index,columns.map,sortByValue,sortedorder,columns.type,row[columns.map]);"  tabledatadisplay sort="columns.sort" displaydata="row[columns.map]" map="columns.map" markup="columns" typemodel="columns.type" anchor="columns.avalue" rowdata="row" rowflagclick="flagForRowClick"  radiocheckdata="checked_data"  checkdata="checked_data_checkbox"     delete="delete" hrefvalue="columns.value"></td></tr>';
			
				scope.checkStyle=function(index,row){
					scope.checkedAll[index]=row;					
						//for checbox checked
						if(scope.deleted_data!=1){
					var Index=scope.jsonData.indexOf(scope.deleted_data);
					//for removing unecessary checks
								if(Index==-1){
								if(input_type=='checkbox'){
									Index=scope.checked_data_checkbox.indexOf(scope.deleted_data);
									if(Index>-1){
									scope.checked_data_checkbox.splice(Index,1);
									scope.checkedfunction({checked:scope.checked_data_checkbox});							
									}
									}else{if(input_type=='radio'){
									if(scope.deleted_data==scope.checked_data){
										scope.checkedfunction({checked:''});							
										}
									}}	
								}
								}
								
					if(input_type=='checkbox'){
						var localindex=scope.checked_data_checkbox.indexOf(row);
						if(scope.checked_status.indexOf(false)==-1){scope.selecctall[scope.currentPage]=true;}else{scope.selecctall[scope.currentPage]=false;}
						if(localindex>-1){
							var local_local_index=scope.checkedAll.indexOf(row);
							scope.checked_status[index]=true;
							return scope.checked_Class;
						}else{
							scope.checked_status[index]=false;return ''}
					}
					//for radio checked
					
					if(input_type=='radio'){
						if(scope.checked_data==row){
							scope.checked_status[index]=true;
							return scope.checked_Class;				
						}else{scope.checked_status[index]=false;return '';}
					}	
	
				}
				
			//table header	display		
			 element.find('thead').append($compile(scope.tableheader)(scope));
			 element.find('tbody').append($compile(scope.tablebody)(scope));
			//styles for sorted data
			
			//applying background color to sorted td only in ascending condition
			scope.ColStyle=function(rowIndex,map,sortedValue,sortingOrder,type,value){					
			if(type=='priority'){
			var Class=$filter('lowercase')(value);
			return Class;
			}
				if(sortingOrder==false){
					if(map==sortedValue){
						if(rowIndex%2==0){return scope.sorted_Class}else{return ""}
					}
				}
			};
			
			//HTML for table footer---Pagination
			scope.tableFooter = '<div class="tfooter clearfix"><ul class="pagination pull-right"><li class="first" ng-class="isLeftDisabled(countPage)" ng-click="first()"><a><i class="glyphicon glyphicon-first"></i></a></li><li class="prev" ng-class="isLeftDisabled(countPage)" ng-click="previous()"><a><i class="glyphicon glyphicon-prev"></i></a></li><li><span>Showing</span></li><li><input id="paginationTextBox" type="text" class="form-control pginput"  value="1" ng-model="countPage" ng-change="keypressfunction(countPage,jsonData.length/pageSize)" value="{{countPage}}" min="1" max="{{numberOfPages}}"/></li><li><span>of {{Math.ceil(jsonData.length/pageSize)}}</span></li><li class="next"  ng-class="isRightDisabled(countPage,Math.ceil(jsonData.length/pageSize))" ng-click="next()"><a><i class="glyphicon glyphicon-next"></i></a></li><li class="last"  ng-class="isRightDisabled(countPage,Math.ceil(jsonData.length/pageSize))" ng-click="last()" ><a><i class="glyphicon glyphicon-last"></i></a></li></ul></div>';
			element.find('.tblcontainer').parent().append($compile(scope.tableFooter)(scope));
			

			//Initialising scope variables for Pagination 
			scope.currentPage = 0;//assgning default page to zero i.e 1st page
			scope.pageSize = 5;	//declaring the number of records in a page
			scope.countPage=1;	//it counts the page	
			scope.numberOfPages=Math.ceil(scope.jsonData.length/scope.pageSize); //It calculates the number of pages
			scope.Pagenumber=scope.currentPage+1;//it gives the current page number			
			scope.Math=window.Math;
			
			//To display first page on adding a row
			scope.$watch("jsonData.length",function(newvalue,oldvalue){			
				if(newvalue>oldvalue){
					scope.currentPage=0;
					scope.countPage=1;
				}//to hide a error message
				if(newvalue>0){
					element.find('.errorpara').hide();
				}//to show footer when more than single page existed i.e pagination buttons
				if(newvalue>5){
					element.find('.pagination').show();
				}
				//to hide footer for single page i.e pagination buttons
				if(newvalue<=5){
					element.find('.pagination').hide();
				}
			});
			
			/*To display first page on adding a row */
			scope.$watch("jsonData",function(newvalue,oldvalue){
				scope.jsonData = newvalue ? newvalue : [];			
				scope.defaultsorting();
			});
			
			//For pagination on entering number in a textbox 			
			
			scope.keypressfunction=function(pageNo,lastpage){
				var reg = new RegExp('^[0-9]+$');
				var validation=reg.test(pageNo);//validating for number
				
				element.find("#paginationTextBox").keypress(function (e) {
				//if the letter is not digit then display error and don't type anything
					if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
					   return false;
					}
				});
				//if key text is a number then pagination is performed
				if(validation==true){
					if(pageNo!=''){
					scope.Pagenumber= parseInt(pageNo,10);
					if(scope.currentPage!=scope.countPage-1){
						scope.previoustime=0;
					}
					if(scope.Pagenumber>lastpage){//key press is a last page
						scope.Pagenumber=Math.ceil(lastpage);
						scope.countPage=scope.Pagenumber;
					}
					scope.currentPage=scope.Pagenumber-1;
				}
				}
			};
			
			// First Page Click			
			scope.first = function (){
				if(scope.currentPage!=0){
					scope.previoustime=0;//gridFinish callback
				}
				scope.currentPage=0;//assigning current page to zero
				scope.countPage= scope.currentPage+1;		
			}
			
			//Previous Page Click			
			scope.previous=function(){
				if(scope.countPage!=1){
					scope.currentPage=scope.currentPage-1;//decrementing the page
					scope.countPage=scope.currentPage+1;	
					scope.previoustime=0;
				}
			}
			
			//Next Page Click
			
			scope.next=function(){
				if(scope.countPage<scope.jsonData.length/scope.pageSize){
					scope.currentPage=scope.currentPage+1;
					scope.countPage=scope.currentPage+1;		
						scope.previoustime=0;
				}
			}
			
			//Last Page Click			
			scope.last=function(){
				scope.currentPage=Math.ceil(scope.jsonData.length/scope.pageSize - 1);
				if(scope.countPage!=scope.currentPage+1){
					scope.previoustime=0;
				}
				scope.countPage=scope.currentPage+1;	
					
			}
			 //To disable Pagination to left on first page 
			
			scope.isLeftDisabled=function(countPage){
				if(countPage==1){
					return scope.pagination_button_disabled_Class;
				}
			}
			//To disable Pagination to right on last page
			scope.isRightDisabled=function(countPage,lastPage){
				if(countPage==lastPage){
					return scope.pagination_button_disabled_Class;
				}						
			}
			
			//code for static col
			if(scope.complexHeader=="false"){//for complex header staticCol												
			scope.staticCol_tableheader = '<tr>';
			for (k = 0; k < scope.dataModel.length && k<scope.staticols; k++) {
				var show = (typeof scope.dataModel[k].show != 'undefined') ? true : false;
				if (!show) {
					tdwidths = (typeof scope.dataModel[k].width != 'undefined') ? "width=" + scope.dataModel[k].width + "%" : '';
					titles = (typeof scope.dataModel[k].titles != '') ? scope.dataModel[k].titles : '&nbsp;';
					sort = (typeof scope.dataModel[k].sort != 'undefined') ? 'data-sort="' + scope.dataModel[k].sort + '"' : 'data-sort="none"';
					map = (typeof scope.dataModel[k].map != 'undefined') ? scope.dataModel[k].map : '';
					scope.staticCol_tableheader += '<th data-by="' + map + '" tabindex="0"  ' + sort+  ' data-col="' + k + '" ng-click="sort(dataModel['+ k +'].map,dataModel['+ k +'].sort,$event)">' + titles + '</th>';
				}
			}
			scope.staticCol_tableheader += '</tr>';
			}else{
			var row1 = "",
				row2 = "";
				row1 += '<tr>';
				row2 += '<tr>';
				for (var i = 0; i < scope.dataModel.length && i<scope.staticols; i++) {
					show = (typeof scope.dataModel[i].show != 'undefined') ? true : false;
					if (!show) {
						
						titles = (typeof scope.dataModel[i].titles != '') ? scope.dataModel[i].titles : '&nbsp;';
						sort = (typeof scope.dataModel[i].sort != 'undefined') ? 'data-sort="' + scope.dataModel[i].sort + '"' : 'data-sort="none"';
						map = (typeof scope.dataModel[i].map != 'undefined') ? scope.dataModel[i].map : '';
						halign = (typeof scope.dataModel[i].headAlign != 'undefined') ? 'align="' + scope.dataModel[i].headAlign + '"' : '';
						var count = 0,
							titleValue;
						for (var j = 0; j < scope.groupheader.length; j++) {

							if (scope.dataModel[i].map == scope.groupheader[j].startColumnName) {
								count++;
								titleValue = j;
							}
						}
						if (count == 1) {
							row1 += '<th colSpan="' + scope.groupheader[titleValue].numberOfColumns + '" data-by="' + map + '" data-sort="none" tabindex="0" ' + ' align="center">' + scope.groupheader[titleValue].titleText + '</th>';
							for (k = 0; k < scope.groupheader[titleValue].numberOfColumns; k++) {
								row2 += '<th data-by="' + map + '" tabindex="0"  ' + sort + ' ' +  ' data-col="' + i + '" ng-click="sort(dataModel['+ i +'].map,dataModel['+ i +'].sort,$event)" >' + scope.dataModel[i].titles + '</th>';
								i++;
							}
							i--;
						} else {
							row1 += '<th data-by="' + map + '" tabindex="0"  ' + sort + ' ' +  ' data-col="' + i + '" ng-click="sort(dataModel['+ i +'].map,dataModel['+ i +'].sort,$event)">' + scope.dataModel[i].titles + '</th>';
					
						}
					}
				}
				row1 += '</tr>';
				row2 += '</tr>';
				scope.staticCol_tableheader = row1 + row2;

			}
			
			
			//tablebody static col			
			
			scope.staticCol_tablebody='<tr active="true" ng-if="gridload($index)"  ng-repeat="row in filtered=(jsonData)| startFrom:currentPage*pageSize | limitTo:pageSize" ng-click="rowClick(row)"  ng-class="checkStyle($index,row)" ng-if="gridload($index)"><td ng-repeat="columns in dataModel"  ng-if="showtdstatic(columns.show,columns.check,columns.map,sortedorder,$index)" ng-class="ColStyle($parent.$parent.$index,columns.map,sortByValue,sortedorder,columns.type,row[columns.map]);"  tabledatadisplay sort="columns.sort" displaydata="row[columns.map]" map="columns.map" markup="columns" typemodel="columns.type" anchor="columns.avalue" rowflagclick="flagForRowClick"  radiocheckdata="checked_data"  checkdata="checked_data_checkbox"     delete="delete" hrefvalue="columns.value"></td></tr>';
			
			//Condition for displaying td's of static table body
			scope.showtdstatic=function(showable,check,map,sortedorder,index){	
				//For complex header static display
				if(scope.complexHeader=="true"){				
					var flag=1;
					var noOfStaticColumns=scope.staticols;
					for(var j=0;j<scope.staticols;j++){
						if(flag==1&&scope.groupheader[0].startColumnName==scope.dataModel[j].map){
							noOfStaticColumns=scope.staticols-1;
							flag=0;
							if(scope.groupheader[0].numberOfColumns>scope.staticols){
								noOfStaticColumns=j;
							}							
						}
						if(flag==0&&scope.groupheader[0].startColumnName!=scope.dataModel[j].map){
							noOfStaticColumns=scope.staticols;
							if(scope.groupheader[0].numberOfColumns>scope.staticols){
								noOfStaticColumns=j;
								break;
							}
						}	
					}
					scope.staticols=noOfStaticColumns;
				}
				if(check!=undefined){
				if(showable==false ||index>=scope.staticols){				
					return false;
				}else{
					return true;
				}
				}else{
				if(showable==false ||map==undefined||index>=scope.staticols){				
					return false;
				}else{
					return true;
				}
				}
			};
			if(scope.complexHeader=="true"){
				var heightflag=null;
				if(scope.groupheader[0].startColumnName==scope.dataModel[0].map){
					heightflag="settblcontainer";			
				}
				else{
					heightflag="setstaticcol";
				}
			}
			
			var fixedheight=element.find('.tblcontainer thead tr:first-child').height();
			scope.setHeightWidth = function(){
				//setting the height when staticCol occurs	
					staticRowHeight=element.find(".staticCol table>tbody tr").outerHeight();
					if(element.find(".staticCol table>tbody").height()>element.find(".tblcontainer table>tbody").height()){
						element.find(".tblcontainer table>tbody tr").css("height",staticRowHeight-0.3);
					}
					
				
					
					var staticWidth=element.find(".staticCol").find("table thead").width();
					element.find('.tblcontainer').css("margin-left",staticWidth);
					var staticheight=element.find(".staticCol").find("table thead ").height();
					var height=element.find('.tblcontainer thead ').height();
					if(scope.complexHeader=="true" && $window.outerWidth>310){
						if(heightflag=="settblcontainer" && staticheight!=0 && height<staticheight){				
							element.find('.tblcontainer thead tr:first-child').css("height",staticheight);
						}else if(heightflag=="setstaticcol"){
							element.find(".staticCol").find("table thead tr:first-child").css("height",height);
						}else if(staticheight==0){
							element.find('.tblcontainer thead tr:first-child').css("height",fixedheight);
						}
					}else{
						if(staticheight<height){
							element.find(".staticCol").find("table thead tr:first-child").css("height",height);
						}else if(staticheight>height){
							element.find('.tblcontainer thead tr:first-child').css("height",staticheight);
						}
					}
				}
  
			//watching for change in the window size
			scope.$watch(function(){return $window.outerWidth;}, function(newvalue,oldvalue){
				scope.setHeightWidth();			
			});
			scope.$watch(function(){return element.find(".tblcontainer table>tbody").height();}, function(newvalue,oldvalue){
				scope.setHeightWidth();			
			});
			scope.$watch(function(){return screen.width;}, function(newvalue,oldvalue){
				scope.setHeightWidth();			
			});
			//when window size is changed above function is called
			$window.onresize = function() {
				scope.$apply();
			};
			
			 //when element has been loaded sucessfully width for staiccol is calculated and corresponding margin left takes place for tablecontainer
			element.ready(function(){
				scope.setHeightWidth();	
				$compile(element.find('.selectall').attr('ng-model','selecctall[currentPage]').attr('ng-checked','selecctall[currentPage]').attr('ng-change','checkAll(selecctall[currentPage])'))(scope);
			});
			var staticRowHeight;
			
								
			//To delete a Row in a grid	
			scope.delete=function(data){
				scope.flagForRowClick=1;
				if(input_type=='checkbox'){
						scope.deleted_data=data;
					}else{	if(input_type=='radio'){
								scope.deleted_data=data;
							}else{
								scope.deleted_data=1;
							};				
				};
				
				
				var index=scope.jsonData.indexOf(data);
					if(index>=0){
					scope.deleteRow({dataToBeDeleted:data});									
				}
				
				scope.$watch("element.find('.tblcontainer tbody tr').length",function(newvalue,oldvalue){
				//To direct to previous page on deleting all the rows in a page
					if(element.find('.tblcontainer tbody tr').length==0){	
						scope.countPage=Math.ceil(scope.jsonData.length/scope.pageSize);
						scope.currentPage=scope.countPage-1;
					}
				//To hide pagination and to show message on deleting all the records
					if(scope.jsonData.length==0){
						element.find('.errorpara').show();
						element.find('.pagination').hide();
						scope.checkedfunction({checked:''});
					}
				});
			}
			
			//to append static table after table container
			element.find('.tblcontainer').parent().parent().append($compile('<div class="staticCol" ><table class="table table-bordered table-striped table-hover"><thead></thead><tbody></tbody></table></div>')(scope));
			element.find('.staticCol table').find('thead').append($compile(scope.staticCol_tableheader)(scope));
			element.find('.staticCol table').find('tbody').append($compile(scope.staticCol_tablebody)(scope));
			
			//grid finish callback function after loading the grid
			scope.gridcompletecallback=function(){			
				scope.gridFinish({final_CRUD_Object:scope.jsonData});
				scope.previoustime=1;		
			}	
			

			//edit function for a row in a grid
			scope.flagForRowClick=0;
			scope.rowClick = function(data){			
				if(scope.flagForRowClick==0){
					scope.clickRow({clickedrow:data});
				}
				else{
					scope.flagForRowClick=0;
				}
			}
			
			//callback for edit row
			scope.edit=function(data){
				scope.flagForRowClick=1;
				scope.rowIndex=scope.jsonData.indexOf(data);
				scope.rowEditted=scope.editRow({dataToBeEdited:data});//callback for editRow
			}
			
		//trigger the callback function after loading data
		scope.gridload=function(index){
		if(scope.dataLength!=scope.jsonData.length){
			scope.previoustime=0;
			scope.dataLength=scope.jsonData.length;
			scope.flagForRowClick=0;
		}
		var active_tr_length=element.find('.staticCol [active="true"]').length;
		if(active_tr_length==element.find('.tblcontainer [active="true"]').length){
			active_tr_length=active_tr_length-1;
			if(index==active_tr_length && scope.previoustime==0){scope.gridcompletecallback();scope.previoustime=1;}
			}
			return true;
		};	
											
			//loading the template for input boxes from external file
						
			scope.checkedAll=[];				
			scope.selecctall=[];
			
			//compiling the checkboxes with the ng-dataTable
			for(i=0;i<scope.dataModel.length;i++){
				if(scope.dataModel[i].check!=undefined && scope.dataModel[i].type=="checkbox"){
				//for select All option
					$compile(element.find('.selectall').attr('ng-model','selecctall[currentPage]').attr('ng-checked','selecctall[currentPage]').attr('ng-change','checkAll(selecctall[currentPage])'))(scope);
					element.find('.staticCol tbody thead.selectall').attr('ng-model','selecctall[currentPage]').attr('ng-checked','selecctall[currentPage]').attr('ng-change','checkAll(selecctall[currentPage])');	
					
					//for checking All the checkboxes in table this function is called 
					scope.checkAll=function(selectall)
							{							
									if(selectall==true){//If selectall in page is true it becomes false when it is already true 
											if(scope.checked_status.indexOf(false)==-1){
												selectall=false;
												scope.selecctall[scope.currentPage]=false;
											}
										}								
									if(selectall==true){ //If selectall in page is true all the checkboxes in a page will be selected 
											for(i=0;i<scope.checked_status.length;i++){
												scope.checked_status[i]=true;			
											}
											for(i=0;i<scope.checkedAll.length;i++){
											var index=scope.checked_data_checkbox.indexOf(scope.checkedAll[i]);
													if(index<0){
														scope.checked_data_checkbox.push(scope.checkedAll[i]);
													}
											}
											scope.checkedfunction({checked:scope.checked_data_checkbox}); //callback function is triggered on selecting checkbox
									}else{
										for(i=0;i<scope.checked_status.length;i++){
												scope.checked_status[i]=false;			
										}
										for(i=0;i<scope.checkedAll.length;i++){
											var index=scope.checked_data_checkbox.indexOf(scope.checkedAll[i]);
													if(index>-1){
														scope.checked_data_checkbox.splice(index,1);
													}
											}	
											scope.checkedfunction({checked:scope.checked_data_checkbox});	
									}
								
							}
						}
						
					}
					
				scope.defaultsorting();//to perform default sorting this function is called
		}		
	}
}); 

//Directive for table data display
app.directive('tabledatadisplay',function($compile){
	return{
		restrict:'A',
		scope:{
		markup:'=markup',
		type:'=typemodel',
		sort:'=sort',
		displaydata:'=displaydata',
		map:'=map',
		checked_data_checkbox:'=checkdata',
		flagForRowClick:'=rowflagclick',
		radiocheckstatus:"=checked_data",
		checked_data:'=radiocheckdata',
		avalue:'=anchor',
		row:'=rowdata',
		anchorvalue:'=hrefvalue',
		delete:'&delete',
		},template:'<span ng-if="avalue!=true?true:false" rowflagclick="flagForRowClick" >{{displaydata}}</span><span ng-if="avalue==true?true:false"><a href="{{row[anchorvalue]}}">{{displaydata}}</a></span><span typemodel="type" ng-if="map==undefined" markup-dir rowflagclick="flagForRowClick"  delete="$parent.delete" markup="markup" checkdata="checked_data_checkbox" radiocheckstatus="checked_data" ></span>',
		link:function(scope,element,attrs){
		
		
		}
	}
});

//Directive to add click function to edit and delete icons
app.directive('markupDir',function($compile){
	return{
		restrict:'A',
		scope:{
			markup:'=markup',
			delete:'&delete',
			type:'=typemodel',
			flagForRowClick:'=rowflagclick',
			checked_data_checkbox:'=checkdata',
			checked_data:'=radiocheckdata'
		},
		link:function(scope,element,attrs){	
	scope.$parent.$parent.$parent.$parent.$parent.$parent.checked_status[scope.$parent.$parent.$parent.$parent.$parent.$index]=false;
		scope.alreadyclicked=false;
		//scope.checked_status=false;//for row checked default
			//markup for edit
			if(scope.markup.edit!=undefined){
				element.append($compile('<span ng-click="$parent.$parent.$parent.edit($parent.$parent.$parent.$parent.row);">'+scope.markup.edit+'</span>')(scope));				
			}
			
				//markup for checkbox
		if(scope.markup.check!=undefined && scope.type=='radio')
		{
		element.parent().parent().parent().parent().parent().find('.selectall').hide();
		
		element.append($compile('<span>'+scope.markup.check+'</span>')(scope));
		$compile(element.find('input[type="checkbox"]').attr('ng-model','$parent.$parent.$parent.$parent.$parent.$parent.checked_status[$parent.$parent.$parent.$parent.$parent.$index]').attr('ng-checked','$parent.$parent.$parent.$parent.$parent.$parent.checked_status[$parent.$parent.$parent.$parent.$parent.$index]').attr('ng-change','getChecked_radio($parent.$parent.$parent.$parent.$parent.$parent.checked_status[$parent.$parent.$parent.$parent.$parent.$index],$parent.$parent.$parent.$parent.$parent.row)'))(scope);		
			
			//get checked after change in the row
			scope.getChecked_radio=function(checked_status,data)
			   {			   
			   scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent.flagForRowClick=1;//for static column
			 scope.$parent.$parent.$parent.$parent.$parent.$parent.flagForRowClick=1;//for non-static column
					if(checked_status==true)
				   {
				   scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent.checked_data=data;//for staticCol
				   scope.$parent.$parent.$parent.$parent.$parent.$parent.checked_data=data;//for non static columns
						scope.$parent.$parent.$parent.checkedfunction({checked:data});//return object to the callback
				   }else{
				   scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent.checked_data='';
				   scope.$parent.$parent.$parent.$parent.$parent.$parent.checked_data='';
				   scope.$parent.$parent.$parent.checkedfunction({checked:''});//returns empty object when unchecked
				   }
			   };
		
		}
		
		//markup for  checkAll checkbox
		if(scope.markup.check!=undefined && scope.type=='checkbox')
		{
			
		element.append($compile('<span>'+scope.markup.check+'</span>')(scope));
		$compile(element.find('input[type="checkbox"]').attr('ng-model','$parent.$parent.$parent.$parent.$parent.$parent.checked_status[$parent.$parent.$parent.$parent.$parent.$index]').attr('ng-checked','$parent.$parent.$parent.$parent.$parent.$parent.checked_status[$parent.$parent.$parent.$parent.$parent.$index]').attr('ng-change','getChecked($parent.$parent.$parent.$parent.$parent.$parent.checked_status[$parent.$parent.$parent.$parent.$parent.$index],$parent.$parent.$parent.$parent.$parent.row)').addClass('.checkbox1'))(scope);		
			
			//get checked after change in the row
			scope.getChecked=function(checked_status,data)
			   {
			      scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent.flagForRowClick=1;
				 scope.$parent.$parent.$parent.$parent.$parent.$parent.flagForRowClick=1;
					if(checked_status==true)
				   {
						
						scope.checked_data_checkbox.push(data);
						scope.$parent.$parent.$parent.checkedfunction({checked:scope.checked_data_checkbox});	
				   }
				   
				   if(checked_status==false)
				   {
						var index=scope.checked_data_checkbox.indexOf(data);
						scope.checked_data_checkbox.splice(index,1);
						scope.$parent.$parent.$parent.checkedfunction({checked:scope.checked_data_checkbox});						
				   }
				   
			   };	
			  				
		}
				
				
			//markup for delete
			if(scope.markup.delete!=undefined){
				element.append($compile('<span ng-click="$parent.$parent.$parent.$parent.delete($parent.$parent.$parent.$parent.row)">'+scope.markup.delete+'</span>')(scope));
			}			
			
		}
	}
});






//Directive for static column
app.directive('staticolumn',function($compile){
	return{
		restrict:'A',
		scope:{
			complexheader:'=complex',
			staticcol:'=staticvalue',
			groupheader:'=group',
			dataModel:'=datamodel'
		},
		link:function(scope,element,attrs){
		if(scope.dataModel[0].check!=undefined && scope.staticcol!=undefined){
				scope.staticcol=1;
			}
		//condition to hide columns for simple header
			if(scope.complexheader=="false"){
				if(scope.staticcol==undefined){
					scope.staticcol=0;
				}
				if(scope.staticcol==1){
				
					element.addClass("noComplexHeader hideonecols");
				}
				if(scope.staticcol==2){
					element.addClass("noComplexHeader hidetwocols");
				}
			}
			else{	//condition to hide columns for complex header
				var hideColumns=scope.staticcol;
				if(scope.groupheader[0].numberOfColumns>2){
					if(scope.groupheader[0].startColumnName==scope.dataModel[0].map){
						hideColumns=0;
					}
					if(scope.groupheader[0].startColumnName==scope.dataModel[1].map){
						hideColumns=1;
					}
				
				}else{
				for(var i=0;i<scope.staticcol;i++){
					if(scope.groupheader[0].startColumnName==scope.dataModel[i].map){
						if(scope.staticcol-1==i){
							hideColumns=scope.staticcol-1;
						}
					}
				}
				}
				scope.staticcol=hideColumns;
				if(scope.staticcol==1){
					element.addClass("hideonecomplexcols");
				}
				if(scope.staticcol==2){
					var flag=1;
					for(var j=0;j<scope.staticcol;j++){
						if(scope.groupheader[0].startColumnName==scope.dataModel[j].map){
							flag=0;
						}
					}
					if(flag==1){
						element.addClass("hidetwocomplexcols1");
					}
					else{
						element.addClass("hidetwocomplexcols2");
					}
				}
			}
		}
	}
});

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
    return function(input, start) {
    	input = input ? input : [];
        start = +start; //parse to int
        return input.slice(start);
    }
});
