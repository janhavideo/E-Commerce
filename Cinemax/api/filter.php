<?php
$result=NULL;

if($_SERVER["REQUEST_METHOD"] == "POST")
{
	$keyword=$_POST['keyword'];
	$price1=$_POST['price1'];
	$price2=$_POST['price2'];
	$genre=$_POST['genre'];
	$genreImp = join("','", $genre);
	
	$conn=mysqli_connect("localhost","root","root","MOVIE");
	if(mysqli_connect_errno())
		{
			echo "Connection Failed: ".mysqli_connect_error();
		}

	if($keyword!="" && $price1=="" && $price2=="" && $genre=="") //only keyword
	{
		$query1=mysqli_query($conn,"SELECT * FROM movieinfo WHERE moviename LIKE '%$keyword' OR moviename LIKE '$keyword%' OR moviename LIKE '%$keyword%' AND deleteflag=0 AND availableqty>0");
	}
	if($keyword=="" && $price1!="" && $price2!="" && $genre=="") //only price range
	{
		$query1=mysqli_query($conn,"SELECT * FROM `movieinfo` WHERE deleteflag=0 AND cost BETWEEN $price1 AND $price2 and availableqty>0");
	}
	if($keyword=="" && $price1=="" && $price2=="" && $genre!="") //only genre
	{
		$query1=mysqli_query($conn,"SELECT * FROM `movieinfo` WHERE deleteflag=0 AND availableqty>0 AND moviename IN (SELECT  DISTINCT moviename FROM movieinfo NATURAL JOIN genres WHERE genre IN('$genreImp'))");
	}

	if($keyword!="" && $price1!="" && $price2!="" && $genre=="") //only keyword and price
	{
		$query1=mysqli_query($conn,"SELECT * FROM `movieinfo` WHERE deleteflag=0 AND availableqty>0 AND cost BETWEEN $price1 AND $price2 AND (moviename LIKE '%$keyword' OR moviename LIKE '$keyword%' OR moviename LIKE '%$keyword%')");
	}
	if($keyword!="" && $price1=="" && $price2=="" && $genre!="") //only keyword and genre
	{
		$query1=mysqli_query($conn,"SELECT * FROM `movieinfo` WHERE moviename IN(SELECT DISTINCT moviename FROM movieinfo NATURAL JOIN genres WHERE deleteflag=0 AND availableqty>0 AND moviename LIKE '%$keyword' OR moviename LIKE '$keyword%' OR moviename LIKE '%$keyword%' AND genre IN ('$genreImp'))");
	}
	if($keyword=="" && $price1!="" && $price2!="" && $genre!="") //only genre and price
	{
		$query1=mysqli_query($conn,"SELECT * FROM `movieinfo` WHERE moviename IN(SELECT DISTINCT moviename FROM movieinfo NATURAL JOIN genres WHERE deleteflag=0 AND availableqty>0 AND cost BETWEEN $price1 AND $price2 AND genre IN ('$genreImp'))");
	}	

	if($keyword!="" && $price1!="" && $price2!="" && $genre!="") //all values present
	{
		$query1=mysqli_query($conn,"SELECT * FROM `movieinfo` WHERE moviename IN(SELECT DISTINCT moviename FROM movieinfo NATURAL JOIN genres WHERE deleteflag=0 AND availableqty>0 AND genre IN('$genreImp') AND cost BETWEEN $price1 AND $price2 AND (moviename LIKE '%$keyword' OR moviename LIKE '$keyword%' OR moviename LIKE '%$keyword%'))");
	}
	
	while($row=mysqli_fetch_assoc($query1))
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

}

	
?>