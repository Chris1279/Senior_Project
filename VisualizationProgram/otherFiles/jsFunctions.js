


// Function used for getting related articles and call for PHP functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchDataKeyword()
{
	var keyword = document.getElementById("keyword").value;
	var dataString = 'keyword1=' + keyword;
	$.ajax(
	{
		type: "GET",
		url: "dataFiles/search.php",
		data: dataString,
		success: function(data) 
		{
			loadData();
			loadTopTerms();
		}
	});
}

// Function used for loading related articles into a table in SVG
// *INITIALIZE EMPTY / FILLS WHEN USER SEARCHES*
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadData()
{
	// Data is determined by PHP file and saved to a CSV file which is loaded by using D3
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	d3.csv("dataFiles/newfile.csv", function(error, dataset) {
		dataset.forEach(function(d) {
			d.topic = d.topic;
			d.docname = d.docname;
			d.filename = d.filename;
			d.distribution = +d.distribution;
		});
		data = dataset;
		
		// Clearing table
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		position = -27;
		opacVal = 1;
		svg.selectAll("g")
			.remove();

		// Loading rectangles and text to each G element which represents each article
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		var entry = svg.selectAll("g")
			.data(data);
			
		var entryEnter = entry.enter().append("g")
			.attr("class", "entry")
			.attr("height", 27)
			.attr("width", width-44)
			.attr("transform", function(d){position=position+27; return "translate(0,"+position+")";})
			.on("click", function(d)
						{
							var x=("pdfProjectData/"+d.filename); 
							$('#pdf').attr('data', x); 
							$('#pdf').load(x);
							d3.select(this).style("text-decoration", "line-through");
						});
			
		entryEnter.append("rect")
			.attr("y", -14)
			.attr("height", 27)
			.attr("width", width-44)
			.style("fill", "#98AFC7")
			.style("fill-opacity", function(d){return (opacVal = opacVal-.05);})
			.style("stroke","#3182bd")
			.style("stroke-width","1")
			.on("mouseover", function(){d3.select(this).style("fill", "rgba(0, 255, 0, 1)");})
			.on("mouseout", function() {d3.select(this).style("fill", "#98AFC7");});
			
		entryEnter.append("text")
			.attr("dy", 3.5)
			.attr("dx", 5.5)
			.text(function(d){return d.docname;});
	});
}


// Function used for randomly selecting 7 of the 100 top terms and entering them into a table in SVG2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadTopTerms()
{
	// Data is predetermined in a CSV file and loaded using D3
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	d3.csv("dataFiles/topTerms.csv", function(error, dataset) {
		dataset.forEach(function(d) {
			d.term = d.term;
			d.distribution = +d.distribution;
		});
		topTerms = dataset;
		
		// Loop to get 7 new random terms
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		for(var i=0; i<7; i++)
		{
			tempTopTerms[i] = topTerms[Math.floor((Math.random() * 100))];
		}
		
		// Clearing previous terms in table
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		svg2.selectAll("td")
			.remove();

		// Entering terms into table
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		var tableTerm = svg2.selectAll("tr")
			.data(tempTopTerms);
			
		var tableRowTerm = tableTerm.enter().append("td")
			.attr("class", "termTD")
			.attr("height", 30)
			.attr("width", 30)
			.on("click", function(d){document.getElementById("keyword").value=d.term; searchDataKeyword();});
		
		// Load term to text input field if selected
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		tableRowTerm.append("text")
			.attr("id", "termTXT")
			.attr("dy", 3.5)
			.attr("dx", 5.5)
			.text(function(d){return d.term;});
	});
}

// Function used entering letters into the text input field when an on screen letter is selected
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function screenKey(val)
{
	var value = val;
	if(value == '!')
	{textField = textField.substring(0, (textField.length-1));}
	else
	{textField = textField+value;}
	if(value == '$')
	{
		textField = "";
		position = -27;
		opacVal = 1;
		svg.selectAll("g")
			.remove();
	}
	document.getElementById("keyword").value = textField;
}




