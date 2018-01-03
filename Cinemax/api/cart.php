<?php
if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$action = $_POST["action"];
	function displaycart() {
		$userid=$_POST['userid'];
		
		$conn=mysqli_connect("localhost","root","root","MOVIE");
		if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}
		$query2=mysqli_query($conn,"SELECT movieinfo.serialno, purchaseno, moviename, image, quantity, cost FROM orderhistory NATURAL JOIN movieinfo WHERE `userid`='$userid' AND `status`='N'");

		while($row=mysqli_fetch_assoc($query2))
		{
			$movies=array(
				"purchaseno"=>$row["purchaseno"],
				"serialno"=>$row["serialno"],
				"moviename"=>$row["moviename"],
				"cost"=>$row["cost"],
				"quantity"=>$row["quantity"],
				"image"=>$row["image"]
				);
			$temp[]=$movies;
		}
		$resultarray=json_encode($temp);
		mysqli_close($conn);
		echo $resultarray;
	}

	function updatecart() {
		$purchaseno=$_POST['purchaseno'];
		$quantity=$_POST['quantity'];
		$serialno=$_POST['serialno'];

		$conn=mysqli_connect("localhost","root","root","MOVIE");
		if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}
		$query1=mysqli_query($conn,"SELECT availableqty FROM movieinfo WHERE serialno=$serialno");
		$row = mysqli_fetch_row($query1);
		$result=$row[0];
		if($result>=$quantity)
		{
			$finalqty=$result-$quantity;
			$query2=mysqli_query($conn,"UPDATE orderhistory SET quantity=$quantity WHERE purchaseno=$purchaseno AND status='N'");
			$query3=mysqli_query($conn,"UPDATE movieinfo SET availableqty=$finalqty WHERE serialno=$serialno");
			$message="Your order has been updated successfully";
		}
		else
		{
			$message="The quantity you have selected is greater than the available quantity";
		}
		mysqli_close();
		echo $message;
	}

	function deletecart() {
		$serialno=$_POST['serialno'];
		$purchaseno=$_POST['purchaseno'];
		$quantity=$_POST['quantity'];
		$date= date("y.m.d");
		$status= "Y";
		
		$conn=mysqli_connect("localhost","root","root","MOVIE");
		if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}
		$query1=mysqli_query($conn,"SELECT availableqty FROM movieinfo WHERE serialno=$serialno");
		$row = mysqli_fetch_row($query1);
		$result=$row[0];
		$finalqty=$result+$quantity;
		$query2=mysqli_query($conn,"DELETE FROM orderhistory WHERE purchaseno=$purchaseno");
		$query3=mysqli_query($conn,"UPDATE movieinfo SET availableqty=$finalqty WHERE serialno=$serialno");
		$message="Your order has been deleted from cart successfully";
		mysqli_close();
		echo $message;
	}

	function addcart() {
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

		$query1=mysqli_query($conn,"SELECT availableqty FROM movieinfo WHERE serialno=$serialno");
		$query4=mysqli_query($conn,"SELECT * FROM orderhistory WHERE serialno=$serialno AND userid=$userid AND status='N'");
		$rowcount=mysqli_num_rows($query4);
		$row = mysqli_fetch_row($query1);
		$result=$row[0];
		if($result>=$quantity)
		{
			if($rowcount==0)
			{
				$finalqty=$result-$quantity;
				$query2=mysqli_query($conn,"INSERT INTO orderhistory (`userid`,`serialno`,`date`,`quantity`,`status`) VALUES('$userid','$serialno','$date','$quantity','$status')");
				$query3=mysqli_query($conn,"UPDATE movieinfo SET availableqty=$finalqty WHERE serialno=$serialno");
				$message="Your order has been added to cart successfully";
			}
			else
			{
				$finalqty=$result-$quantity;
				$query2=mysqli_query($conn,"SELECT quantity FROM orderhistory WHERE serialno=$serialno AND userid=$userid AND status='N'");
				$row1 = mysqli_fetch_row($query2);
				$qty=$row1[0]+1;
				$query3=mysqli_query($conn,"UPDATE orderhistory SET quantity=$qty WHERE serialno=$serialno AND userid=$userid AND status='N'");
				$query3=mysqli_query($conn,"UPDATE movieinfo SET availableqty=$finalqty WHERE serialno=$serialno");
				$message="Your order has been added to cart successfully";
			}
		}
		else
		{
			$message="The quantity you have selected is greater than the available quantity";
		}
		mysqli_close();
		echo $message;
	}

	function checkoutCart() {
		$purchasenoArray = $_POST["purchasenoArray"];
		$purchaseno = join("','", $purchasenoArray);
		$date= date("y.m.d");
		$status= "Y";
		
		$conn=mysqli_connect("localhost","root","root","MOVIE");
		if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}
		$query2=mysqli_query($conn,"UPDATE orderhistory SET `status`='$status', `date`='$date' WHERE `purchaseno` IN ('$purchaseno')");
		$message="Your order has been placed successfully";
		mysqli_close();
		echo $message;
	}

	switch ($action) {
		case 'addcart':
			addcart();
			break;
		case 'updatecart':
			updatecart();
			break;
		case 'deletecart':
			deletecart();
			break;
		case 'checkoutCart':
			checkoutCart();
			break;
		default:
			displaycart();
	}
}

?>
