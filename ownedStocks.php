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
    $userID = $_GET['id'];
    $arr = array();
    //iterates through all the stocks that the specified user owns and returns the company name, recent change and direction
    foreach($conn->query("SELECT companyname, recentchange, recentchangedirection FROM Stocks s, owns o, users u where s.id = o.stockID AND u.userID = o.userID AND o.userID = '$userID' ORDER BY companyname") as $row) {
        
        $rowA = array("name"=>$row['companyname'], "move"=>$row['recentchange'], "direction"=>$row['recentchangedirection']);
        $arr[] = $rowA;
    }
    //return the info about each company back to the js as a JSON object
    $json = json_encode($arr);
    echo $json;
}

catch(PDOException $e){
    die("ERROR: Could not able to execute $conn. " . $e->getMessage());
}
?>
