<?php
$result=NULL;


if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$serialno=$_POST['serialno'];
	$moviename=$_POST['moviename'];
	$image=$_POST['image'];
	$cost=$_POST['cost'];
	$availability=$_POST['availability'];
	
	$conn=mysqli_connect("localhost","root","root","MOVIE");
	if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}
	else
	{
		if($moviename!="")
			$query1=mysqli_query($conn,"UPDATE movieinfo SET moviename='$moviename' WHERE serialno=$serialno");

		if($image!="")
			$query2=mysqli_query($conn,"UPDATE movieinfo SET image='$image' WHERE serialno=$serialno");

		if($cost!="")
			$query3=mysqli_query($conn,"UPDATE movieinfo SET cost=$cost WHERE serialno=$serialno");

		if($availability!="")
			$query4=mysqli_query($conn,"UPDATE movieinfo SET availableqty=$availability WHERE serialno=$serialno");
	}

	$result="Movie Details Updated Successfully";

echo $result;
mysqli_close();

}
	
?>

