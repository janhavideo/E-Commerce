<?php


if($_SERVER["REQUEST_METHOD"] == "POST")
{

	$userid= $_POST['userid'];
	$conn=mysqli_connect("localhost","root","root","movie");
	if(mysqli_connect_errno())
	{
		echo "Connection Failed: ".mysqli_connect_error();
	}
	
	$result=mysqli_query($conn,"SELECT `purchaseno`,`moviename`,`image`,`date`,`quantity`,`cost` FROM orderhistory NATURAL JOIN movieinfo WHERE `userid`=$userid AND `status`='Y'");
	
	while($row=mysqli_fetch_assoc($result))
		{
			$movies=array(
				"moviename"=>$row["moviename"],
				"date"=>$row["date"],
				"quantity"=>$row["quantity"],
				"image"=>$row["image"],
				"purchaseno"=>$row["purchaseno"],
				"cost"=>$row["cost"]
				);
			$temp[]=$movies;
		}
		$resultarray=json_encode($temp);
		mysqli_close($conn);
		echo $resultarray;
	}

?>