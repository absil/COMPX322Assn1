<?php
	//attempts a connection to the database
    try {
    	$conn = new PDO('mysql:host=mysql.cms.waikato.ac.nz;dbname=acs45;', 'acs45', 'my10938600sql');
    	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $e) {
    	echo 'Connection failed: ' . $e->getMessage();
}
    try{       
        $name = $_GET['name'];
	//execute a query to recieve more infomation about the given company in the stocks table
        $query = $conn->prepare("SELECT companyname, currentprice, recentchange, annualtrend, recentchangedirection FROM Stocks WHERE companyname = '$name'");
        $query->execute();
        $row = $query->fetch();
        
        $info = array("company"=>$row['companyname'], "price"=>$row['currentprice'], "change"=>$row['recentchange'], "annual"=>$row['annualtrend'], "direction"=>$row['recentchangedirection']);
        //return the information about the company
        echo json_encode($info);        
    }
    catch(PDOException $e){
         die("ERROR: Could not able to execute $conn. " . $e->getMessage());
    }
?>
