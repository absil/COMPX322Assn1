<?php
//attempt a connection to the database
try {
    $conn = new PDO('mysql:host=mysql.cms.waikato.ac.nz;dbname=acs45;', 'acs45', 'my10938600sql');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
    try{
        $arr = array();
        $userID = $_GET['user'];
	//queries the database to return a list of company names that the specified user does not currently own/watch
        foreach($conn->query("SELECT DISTINCT companyname, id FROM `Stocks` s, `users` u WHERE s.id NOT IN (SELECT stockID from owns where userID = $userID)") as $row) {        
           array_push($arr, array("name"=>$row['companyname'], "id"=>$row['id']));
        }
	//return the array of company names as a JSON object
        $json = json_encode($arr);
        echo $json;
    }
    catch(PDOException $e){
        die("ERROR: Could not able to execute $conn. " . $e->getMessage()); 
    }

?>
