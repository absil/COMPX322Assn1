<?php
	
//connects to the database
    try {
	    $conn = new PDO('mysql:host=mysql.cms.waikato.ac.nz;dbname=acs45;', 'acs45', 'my10938600sql');
	    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (PDOException $e) {
	    echo 'Connection failed: ' . $e->getMessage();
	}

    try{
	//recieves the data sent in the ajax request (stock ids to be added for the specified user)
        $a = json_decode($_POST['data']);
        $user = $_POST['user'];
	
	//loops through each stock id in the array, makes an insert query on the owns table to add the stock to the user's owned stocks
        foreach($a as $obj){
            $conn->exec("INSERT INTO `owns`(`userID`, `stockID`) VALUES ('$user', $obj)");
        }        
    }
    catch(PDOException $e){
        die("ERROR: Could not able to execute $conn. " . $e->getMessage()); 
    }

?>
