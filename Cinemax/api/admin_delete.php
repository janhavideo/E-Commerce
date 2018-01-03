<?php
$result=NULL;


if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$serialno=$_POST['serialno'];
	
	$conn=mysqli_connect("localhost","root","root","MOVIE");
	if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}
	$query1=mysqli_query($conn,"UPDATE movieinfo SET deleteflag=1 WHERE serialno=$serialno");

	$result="Movie Deleted Successfully";

echo $result;
mysqli_close();

}
	
?>

