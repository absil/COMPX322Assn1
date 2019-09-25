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
	//prepares a quert to check is the user is in the database, then executes the query
    $statement = $conn->prepare('SELECT userID FROM users WHERE username = :user');    
    $statement->bindParam(':user', $_POST['username']);    
    $statement->execute();
    
//if they are in the database
    if($statement->rowCount() > 0){        
        while($row = $statement->fetch(PDO::FETCH_ASSOC)) {
		//check that the user inputted password matches the username given
            $userID = $row['userID'];
            $pStat = $conn->prepare('SELECT userID, fName, sName FROM users WHERE userID = :ui AND password = :pass');
            $pStat->bindParam(':ui', $userID);
            $pStat->bindParam(':pass', $_POST['password']);
            $pStat->execute();
            
		//if the username and password is in the database, echoback the username, first name and surname
            if($pStat->rowCount() > 0){
                $result = $pStat->fetchAll(PDO::FETCH_ASSOC);
                $json = json_encode($result);
                echo $json;
            }
            else{ 
                //if the password does not match the given username, send back code -2
                echo -2;
                }
            }
        }
    else {
        // if the username is not found, send back code -1
        echo -1;
    }
    
}
catch(PDOException $e){
    die("ERROR: Could not able to execute $conn. " . $e->getMessage()); 
}
?>
