<?php

$conn=mysqli_connect("localhost","root","root","movie");
	if(mysqli_connect_errno())
	{
		echo "Connection Failed: ".mysqli_connect_error();
	}
	
	$result=mysqli_query($conn,"SELECT * FROM movieinfo WHERE deleteflag=0 AND availableqty>0");
	

	while($row=mysqli_fetch_assoc($result))
		{
			$movies=array(
				"serialno"=>$row["serialno"],
				"moviename"=>$row["moviename"],
				"imageUrl"=>$row["image"],
				"cost"=>$row["cost"],
				"deleteflag"=>$row["deleteflag"],

				);
			$temp[]=$movies;
		}
		$resultarray=json_encode($temp);
		mysqli_close($conn);
		echo $resultarray;
?>