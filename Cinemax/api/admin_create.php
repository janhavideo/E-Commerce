<?php
$result=NULL;


if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$moviename=$_POST['moviename'];
	$image=$_POST['image'];
	$cost=$_POST['cost'];
	$availability=$_POST['availability'];
	
	$conn=mysqli_connect("localhost","root","root","MOVIE");
	if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}
	$query1=mysqli_query($conn,"INSERT INTO movieinfo (moviename,image,cost,availableqty) VALUES ('$moviename','$image',$cost,$availability)");
	$result="Movie Added Successfully";

echo $result;
mysqli_close();

}
	
?>

