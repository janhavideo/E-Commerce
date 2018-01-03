<?php
	$result=NULL;

	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$username=$_POST['username'];
		$password=$_POST['password'];
		$hashedpass=md5($password);
		
		$conn=mysqli_connect("localhost","root","root","MOVIE");
		if(mysqli_connect_errno())
			{
				echo "Connection Failed: ".mysqli_connect_error();
			}
		$query1=mysqli_query($conn,"SELECT * FROM userinfo WHERE username='$username' AND password='$hashedpass'");
		$rowcount1=mysqli_num_rows($query1);
		if($rowcount1!=0){
			$query1 = mysqli_fetch_assoc($query1);
			$result = array(
				"userid" => $query1["userid"],
				"username" => $query1["username"],
				"successcode" => 1
			);
		}
		else{
			$result = array(
				"successcode" => 0,
				"message" => "Invalid Username/Password. Please enter valid credentials to login"
			);
		}	
		$result = json_encode($result);
		echo $result;
		mysqli_close();
	}
?>