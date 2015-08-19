<?php

	// Connecting to database
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$username = "kevin";
	$password = "kevin";
	$host = "localhost";
	$database = "projectdata";
	$conn = new mysqli($host, $username, $password, $database);
	if ($conn->connect_error) {die("Connection failed: " . $conn->connect_error);}
	
	// Query to select top 10 topics that relate to the keyword and saved to array1
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$keyword2 = $_GET['keyword1'];
	$topicID = "SELECT t.id, t.topic, d.distribution FROM topics t JOIN disttermtopic d ON t.id = d.topic_id2
					WHERE t.id IN 
					(
						SELECT d.topic_id2 FROM disttermtopic WHERE d.term_id = 
						(SELECT id FROM terms WHERE term = '$keyword2')
					)ORDER BY d.distribution DESC LIMIT 10;";
	$array1 = $conn->query($topicID);

	// Loop of queries that inserts the articles and combines the distribution of the terms per document and
	// the distribution of the documents per topic
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if ($array1->num_rows > 0) {
		while($row = $array1->fetch_assoc()) {
			$insertTemp = "INSERT INTO temptable (docname, filename, distribution) 
							(SELECT d.docname, d.filename, t.distribution*".$row["distribution"]." FROM documents d 
								JOIN distdoctopic t ON d.id = t.docname_id WHERE d.id IN(SELECT t.docname_id FROM distdoctopic 
								WHERE t.topic_id1 = ".$row["id"]." ) ORDER BY t.distribution DESC);\n";
			$tempQuery = $conn->query($insertTemp);
			$insertTemp = "UPDATE temptable SET topic = '".$row["topic"]."' WHERE topic IS NULL;\n";
			$tempQuery = $conn->query($insertTemp);
		}
	}

	// Query of temporary table to select top 25 entries of data and store to array2, then to a CSV string returnVal
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$returnVal = "topic,docname,filename,distribution\n";
	$topResults = "SELECT * FROM temptable ORDER BY distribution DESC LIMIT 25";
	$array2 = $conn->query($topResults);
	if ($array2->num_rows > 0) {
		while($row2 = $array2->fetch_assoc()) 
		{$returnVal .= ($row2["topic"]. "," . $row2["docname"]. "," . $row2["filename"]. "," . $row2["distribution"]."\n");}
	}

	// The string, returnVal, is saved to a CSV file
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$myfile = fopen("newfile.csv", "w") or die("Unable to open file!");
	fwrite($myfile, $returnVal);
	echo $returnVal;
	fclose($myfile);

	// Temporary table is cleared and connection to database is closed
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$clearTable1 = "TRUNCATE TABLE temptable;";
	$clearTable2 = $conn->query($clearTable1);
	$conn->close();
?>






