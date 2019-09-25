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
	//executes a delete query which removes the specified stock for the specified user, removing it from their list of 'watched' stocks
        $userID = $_GET['user'];
        $stock = $_GET['stock'];
        $conn->exec("DELETE FROM `owns` WHERE userID = $userID AND stockID = (SELECT id from `Stocks` where companyname = '$stock')");
    }
    catch(PDOException $e){
        die("ERROR: Could not able to execute $conn. " . $e->getMessage()); 
    }

?>
