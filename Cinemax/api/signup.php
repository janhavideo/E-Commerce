<?php
$result=NULL;


if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$username=$_POST['username'];
	$email=$_POST['email'];
	$password=$_POST['password'];
	$phone=$_POST['phone'];
	
	$conn=mysqli_connect("localhost","root","root","MOVIE");
	if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}
	$query1=mysqli_query($conn,"SELECT * FROM userinfo WHERE username='$username'");
	$query2=mysqli_query($conn,"SELECT * FROM userinfo WHERE email='$email'");
	$rowcount1=mysqli_num_rows($query1);
	$rowcount2=mysqli_num_rows($query2);
	if ($rowcount2!=0)
	{
		$result="Email already exists. You have already registered";
	}
	else if($rowcount1!=0)
		$result="Username already exists. Please select different Username";
	else
	{
		
		$hashedpass=md5($password);
		$query3=mysqli_query($conn,"INSERT INTO userinfo (username,password,email,phone) VALUES ('$username','$hashedpass','$email','$phone')");
		$result="Registration Complete!! Welcome to Cinemax";
	}
	
echo $result;
mysqli_close();

}
	
?>