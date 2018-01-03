<?php
$result=NULL;


if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$serialno=$_POST['serialno'];
	$userid=$_POST['userid'];
	$quantity=$_POST['quantity'];
	$date= date("y.m.d");
	$status= "N";
	
	$conn=mysqli_connect("localhost","root","root","MOVIE");
	if(mysqli_connect_errno())
	{
		echo "Connection Failed: ".mysqli_connect_error();
	}
	
	$query2=mysqli_query($conn,"INSERT INTO orderhistory VALUES('$userid','$serialno','$date','$quantity','$status')");
	$message="Your order was added to cart";

echo $message;
mysqli_close();

}
	
?>
