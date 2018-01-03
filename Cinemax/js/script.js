var urlVariable = "http://localhost/";
$(document).ready(function(){
  checksession();
  loadproducts();
  $("#login").click(function(){
    //Retriving values from form
    var message="";
    var username=$("#username").val();
    var password=$("#password").val();
    if(username=="" || password=="")
    {
      message="Please Enter both Username and Password";
      $("#result").html(message);
    }
    if(message=="")
    {
      var values={
          "username":username,
          "password":password,
              }
      $.ajax({

          url: urlVariable+"cinemax/api/login.php",
          type:"post",
          data: values,
          dataType: 'json',
          success:function(response)
          {
            if(response.successcode == 1){
              localStorage.removeItem("username");
              localStorage.removeItem("userid");
              localStorage.setItem("username",response.username);
              localStorage.setItem("userid",response.userid);
              window.location.href = urlVariable+"cinemax/home.html";
            }
            else{
              localStorage.removeItem("username");
              localStorage.removeItem("userid");
              $("#result").html(response.message);
            }
          },
          error:function(response)
          {
            console.log(response);
          }
        });
    }
  });

  /* Registration Form */
  $("#submit").click(function(){
      //Retriving values from form
      var message="";
      var username=$("#username").val();
      var email=$("#email").val();
      var password=$("#password").val();
      var repeatpass=$("#repeatpass").val();
      var phone=$("#phone").val();
      var namelength=username.length;
      var passlength=password.length;
      var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;
      var regex=/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      var passregex=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
      //validate if all fields are filled
      
      if(username=="" || email=="" || password=="" || phone=="" || repeatpass=="")
      {
        message="All the fields are mandatory";
        $("#result").html(message);
      }
      else if(namelength<5)
      {
        //Validate if the user name is greater than 6 characters
        message="Username should be greater than 4 characters";
        $("#result").html(message);
      }
      else if(!regex.test(email))
      {
        //Validate then Email id
        message="Invalid Email. Please enter a valid email id";
        $("#result").html(message);
      }
      else if(!passregex.test(password))
       {
        //Validate for strong password
        message="Invalid Password.<br><br>Password should contain:<ul><li>Atlest 8 characters</li><li>Atleast 1 numeric character</li><li>Atleast 1 lower case letter</li><li>Atleast 1 upper case letter</li><li>Atleat 1 special character</li></ul>";
        $("#result").html(message);
       }
      else if(password!=repeatpass)
       {
        //Validate if the password and repeat password match
        message="Password and Repeat Password do not match";
        $("#result").html(message);
       }
      else if(!numericReg.test(phone))
       {
        //Validate the phone Number
        message="Invalid phone. Please enter a valid phone number";
        $("#result").html(message);
       } 
      if(message=="")
       {
          var values={
              "username":username,
              "email":email,
              "password":password,
              "phone":phone
                  }
          $.ajax({
                url:urlVariable+"cinemax/api/signup.php",
                type:"post",
                data: values,
                success:function(response)
                {
                  $("#msgModal .modal-body p").html(response);
                  $("#msgModal").modal("show");
                },
                error:function(response)
                {
                  console.log(response);
                  alert("error");
                }
          });
        }
    });

  $("#logoutFunction").click(function(){
      localStorage.removeItem("username");
      localStorage.removeItem("userid");
      window.location.href = urlVariable+"cinemax/home.html";
  });

});

$(document).on("click", ".productResultButton", function(){
  var price1 = $("#filterPriceRange").find("input[type='radio']:checked").attr("valOne");
  var price2 = $("#filterPriceRange").find("input[type='radio']:checked").attr("valTwo");
  var genre = [];
  $('input[name="genreVal"]:checked').each(function() {
    genre.push(this.value);
  });
  var keyword = $("#srch-term").val();
  var parameters = {
    "keyword" : keyword,
    "price1" : price1,
    "price2" : price2,
    "genre" : genre
  }
  $.ajax({
    url:urlVariable+"cinemax/api/filter.php",
    type:"post",
    data: parameters,
    dataType: "json",
    success:function(response)
    {
      if(response == "" || response == null || response == undefined){
        var productResult = "<p>No Results Found<p>";
        var list = "";
        $("#listProcuctsResult").html(productResult);
        $("#paginationProduct").html(list);
      }
      else{
        var pageno = 1;
        var productResult = "<div class='col-xs-12 pages no_padding active' id='1'>";
        var user = localStorage.getItem("username");
        var totalRows = response.length;
        var divs = Math.ceil(totalRows/6);
        var count = 0;
        if(user == "Admin"){
          $.each(response, function(i,item){
            productResult = productResult + "<div class='col-xs-3 eachProductBlock'><img class='productImage' src='images/"+item.imageUrl+"' alt='"+item.moviename+"'><div class='productDetails'><label class='productTitle'>"+item.moviename+"</label><span class='cost'>$"+item.cost+"</span><p class='addToCart'><a productId='"+item.serialno+"'>Add to cart</a></p><p class='deleteItem'><a productId='"+item.serialno+"'>Delete Product</a></p><p class='updateItem' ><a productId='"+item.serialno+"'>Update Product</a></p></div></div>";
            count++;
            if(count == 6){
              pageno++;
              if(pageno <= divs){
                productResult = productResult + "</div>";
                productResult = productResult + "<div class='col-xs-12 pages no_padding' id='"+pageno+"'>";
              }
              count = 0;
            }
          });
          $("#addNewProductPage").show();
        }
        else if(user == "" || user == null || user == undefined){
            $.each(response, function(i,item){
              productResult = productResult + "<div class='col-xs-3 eachProductBlock'><img class='productImage' src='images/"+item.imageUrl+"' alt='"+item.moviename+"'><div class='productDetails'><label class='productTitle'>"+item.moviename+"</label><span class='cost'>$"+item.cost+"</span></div></div>";
              count++;
              if(count == 6){
                pageno++;
                if(pageno <= divs){
                  productResult = productResult + "</div>";
                  productResult = productResult + "<div class='col-xs-12 pages no_padding' id='"+pageno+"'>";
                }
                count = 0;
              }
            });
            $("#addNewProductPage").hide();
        }
        else{
          $.each(response, function(i,item){
            productResult = productResult + "<div class='col-xs-3 eachProductBlock'><img class='productImage' src='images/"+item.imageUrl+"' alt='"+item.moviename+"'><div class='productDetails'><label class='productTitle'>"+item.moviename+"</label><span class='cost'>$"+item.cost+"</span><span class='addToCart' style='float: right;'><a class='addProductToCart' productId='"+item.serialno+"'>Add to cart</a></span></div></div>";
            count++;
            if(count == 6){
              pageno++;
              if(pageno <= divs){
                productResult = productResult + "</div>";
                productResult = productResult + "<div class='col-xs-12 pages no_padding' id='"+pageno+"'>";
              }
              count = 0;
            }
          });
          $("#addNewProductPage").hide();
        }
        productResult = productResult + "</div>";
        var list = "";
        for(var i=1; i<=divs; i++){
          if(i == 1){
            list = list + '<li class="page-item"><a class="page-link active" href="#'+i+'">'+i+'</a></li>';
          }
          else{
            list = list + '<li class="page-item"><a class="page-link" href="#'+i+'">'+i+'</a></li>';
          }
        }
        $("#paginationProduct").html(list);
        $("#listProcuctsResult").html(productResult);
        $(".pages").hide();
        $(".pages.active").show();
      }
    },
    error:function(response)
    {
      console.log(response);
      alert("error");
    }
  });
});

$(document).on("click", ".addProductToCart", function(){
    var serialno=$(this).attr('productid');
    var userid=localStorage.getItem('userid');
    var values={
      "serialno":serialno,
      "userid":userid,
      "quantity":1,
      "action":"addcart"
    }
    $.ajax({
        url:urlVariable+"cinemax/api/cart.php",
        type:"post",
        data: values,
        success:function(response)
          {
            $("#msgModal .modal-body p").html(response);
            $("#msgModal").modal("show");
          },
        error:function(response)
          {
            console.log(response);
            alert("error");
          }
    });
});

$(document).on("click", ".updateButton", function(){
  var purchaseno = $(this).parents(".cartItem").attr("purchaseno");
  var qty = $(this).parent().find(".itemNumber").val();
  var serialno = $(this).parents('.cartItem').find('.cartItemDetails').attr('serialno');

  var values={
    "purchaseno":purchaseno,
    "quantity":qty,
    "serialno":serialno,
    "action":"updatecart"
  }
  $.ajax({
      url:urlVariable+"cinemax/api/cart.php",
      type:"post",
      data: values,
      success:function(response)
        {
          $("#msgModal .modal-body p").html(response);
          $("#msgModal").modal("show");
        },
      error:function(response)
        {
          console.log(response);
          alert("error");
        }
  });
});

$(document).on("click", ".deleteButton", function(){
  var purchaseno = $(this).parents(".cartItem").attr("purchaseno");
  var qty = $(this).parent().find(".itemNumber").val();
  var serialno = $(this).parents('.cartItem').find('.cartItemDetails').attr('serialno');

  var values={
    "purchaseno":purchaseno,
    "quantity":qty,
    "serialno":serialno,
    "action":"deletecart"
  }
  $.ajax({
      url:urlVariable+"cinemax/api/cart.php",
      type:"post",
      data: values,
      success:function(response)
        {
          $("#msgModal .modal-body p").html(response);
          $("#msgModal").modal("show");
        },
      error:function(response)
        {
          console.log(response);
          alert("error");
        }
  });
});

$(document).on("click", "#checkoutButton", function(){
  var cartRows = $(this).parents(".cartContainer").find(".cartItem");
  if(cartRows.length > 0){
    var purchasenoArray = [];
    $.each(cartRows, function(i, item){
      var purchaseno = $(item).attr("purchaseno");
      purchasenoArray.push(purchaseno);
    });
    
    var values={
      "purchasenoArray":purchasenoArray,
      "action":"checkoutCart"
    }
    $.ajax({
        url:urlVariable+"cinemax/api/cart.php",
        type:"post",
        data: values,
        success:function(response)
          {
            $("#msgModal .modal-body p").html(response);
            $("#msgModal").modal("show");
          },
        error:function(response)
          {
            console.log(response);
            alert("error");
          }
    });
  }
});

function checksession(){
  var sessionname = localStorage.getItem("username");
  var sessionid = localStorage.getItem("userid");
  if(sessionid == "" || sessionid == null || sessionid == undefined){
    $("#userDetails").html("<li id='userName'><a href='login.html'>Login</a></li><li><a href='signup-backup.html'>New User? Register here</a></li>");
  }
  else{
    $("#userDetails").html("<li id='userName'><a href='#'>"+sessionname+"</a></li><li><a href='history.html'>Your History</a></li><li><a id='logoutFunction'>Logout</a></li>");
    cartPageLoad();
    historyDetailsLoad();
  }
}

function loadproducts(){
  $.ajax({
    url:urlVariable+"cinemax/api/products.php",
    type:"post",
    dataType:"json",
    success:function(response)
    {
      var pageno = 1;
      var productResult = "<div class='col-xs-12 no_padding pages active' id='1'>";
      var user = localStorage.getItem("username");
      var totalRows = response.length;
      var divs = Math.ceil(totalRows/6);
      var count = 0;
      if(user == "Admin"){
        $.each(response, function(i,item){
          productResult = productResult + "<div class='col-xs-3 eachProductBlock'><img class='productImage' src='images/"+item.imageUrl+"' alt='"+item.moviename+"'><div class='productDetails'><label class='productTitle'>"+item.moviename+"</label><span class='cost'>$"+item.cost+"</span><p class='addToCart'><a productId='"+item.serialno+"'>Add to cart</a></p><p class='deleteItem'><a productId='"+item.serialno+"'>Delete Product</a></p><p class='updateItem' ><a productId='"+item.serialno+"'>Update Product</a></p></div></div>";
          count++;
          if(count == 6){
            pageno++;
            if(pageno <= divs){
              productResult = productResult + "</div>";
              productResult = productResult + "<div class='col-xs-12 pages no_padding' id='"+pageno+"'>";
            }
            count = 0;
          }
        });
        $("#addNewProductPage").show();
      }
      else if(user == "" || user == null || user == undefined){
          $.each(response, function(i,item){
            productResult = productResult + "<div class='col-xs-3 eachProductBlock'><img class='productImage' src='images/"+item.imageUrl+"' alt='"+item.moviename+"'><div class='productDetails'><label class='productTitle'>"+item.moviename+"</label><span class='cost'>$"+item.cost+"</span></div></div>";
            count++;
            if(count == 6){
              pageno++;
              if(pageno <= divs){
                productResult = productResult + "</div>";
                productResult = productResult + "<div class='col-xs-12 pages no_padding' id='"+pageno+"'>";
              }
              count = 0;
            }
          });
          $("#addNewProductPage").hide();
      }
      else{
        $.each(response, function(i,item){
          productResult = productResult + "<div class='col-xs-3 eachProductBlock'><img class='productImage' src='images/"+item.imageUrl+"' alt='"+item.moviename+"'><div class='productDetails'><label class='productTitle'>"+item.moviename+"</label><span class='cost'>$"+item.cost+"</span><span class='addToCart' style='float: right;'><a class='addProductToCart' productId='"+item.serialno+"'>Add to cart</a></span></div></div>";
          count++;
          if(count == 6){
            pageno++;
            if(pageno <= divs){
              productResult = productResult + "</div>";
              productResult = productResult + "<div class='col-xs-12 pages no_padding' id='"+pageno+"'>";
            }
            count = 0;
          }
        });
        $("#addNewProductPage").hide();
      }
      productResult = productResult + "</div>";
      var list = "";
      for(var i=1; i<=divs; i++){
        if(i == 1){
          list = list + '<li class="page-item"><a class="page-link active" href="#'+i+'">'+i+'</a></li>';
        }
        else{
          list = list + '<li class="page-item"><a class="page-link" href="#'+i+'">'+i+'</a></li>';
        }
      }
      $("#paginationProduct").html(list);
      $("#listProcuctsResult").html(productResult);
      $(".pages").hide();
      $(".pages.active").show();
    },
    error:function(response)
    {
      console.log(response);
      alert("error");
    }
  });
}

function cartPageLoad(){
  var userid=localStorage.getItem('userid');
  var values={
    "userid":userid,
    "action":""
  }
  $.ajax({
      url:urlVariable+"cinemax/api/cart.php",
      type:"post",
      data: values,
      dataType: "json",
      success:function(response)
        {
          var cartPageHtml = '';
          $.each(response, function(i, item) {
            cartPageHtml = cartPageHtml + '<div class="col-xs-12 cartItem" purchaseno="'+item.purchaseno+'"><div class="col-xs-2 cartItemImage"><img src="images/'+item.image+'" alt="'+item.moviename+'" /></div><div class="col-xs-3 cartItemDetails" serialno="'+item.serialno+'"><label class="control-label">Item Name: </label><p>'+item.moviename+'</p><label class="control-label">Item Cost: </label><p>$'+item.cost+'</p></div><div class="col-xs-3 cartItemAction"><input type="text" name="updateItemNumber" class="itemNumber" value="'+item.quantity+'" /><button type="button" class="btn btn-sm btn-primary updateButton">UPDATE</button><button type="button" class="btn btn-sm btn-primary deleteButton">DELETE</button></div></div>';              
          });
          cartPageHtml = cartPageHtml + '<button class="btn btn-md btn-primary" type="button" id="checkoutButton">CHECKOUT</button>';
          $(".cartContainer").html(cartPageHtml);
        },
      error:function(response)
        {
          console.log(response);
          alert("error");
        }
  });
}
function historyDetailsLoad(){
  var userid=localStorage.getItem('userid');
  var values={
    "userid":userid
  }
  $.ajax({
      url:urlVariable+"cinemax/api/history.php",
      type:"post",
      data: values,
      dataType: "json",
      success:function(response)
        {
          var cartPageHtml = '';
          $.each(response, function(i, item) {
            cartPageHtml = cartPageHtml + '<div class="col-xs-12 cartItem" purchaseno="'+item.purchaseno+'"><div class="col-xs-2 cartItemImage"><img src="images/'+item.image+'" alt="'+item.moviename+'" /></div><div class="col-xs-3 cartItemDetails"><label class="control-label">Item Name: </label><p>'+item.moviename+'</p><label class="control-label">Item Cost: </label><p>$'+item.cost+'</p><label class="control-label">Total Quantity: </label><p>'+item.quantity+'</p><label class="control-label">Date Purchased: </label><p>'+item.date+'</p></div></div>';              
          });
          $(".historyContainer").html(cartPageHtml);
        },
      error:function(response)
        {
          console.log(response);
          alert("error");
        }
  });
}
$(document).on("click", "#addNewProductPage", function(){
  window.location.href = urlVariable+"cinemax/admin_create.html";
});
$(document).on("click", "#adminAddProduct", function(){
  var message="";
  var moviename=$("#moviename").val();
  var image=$("#image").val();
  var cost=$("#cost").val();
  var availability=$("#availability").val();
  var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;

  if(moviename=="" || image=="" || cost=="" || availability=="")
  {
    message="All the fields are mandatory";
    $("#result").html(message);
  }
  else if(!numericReg.test(cost)){
    message="Invalid cost. Please enter numeric values only";
    $("#result").html(message);
  }
  else if(!numericReg.test(availability)){
    message="Invalid availability. Please enter numeric values only";
    $("#result").html(message);
  }

  if(message==""){
    var values={
        "moviename":moviename,
        "image":image,
        "cost":cost,
        "availability":availability
    }
    $.ajax({
      url:urlVariable+"cinemax/api/admin_create.php",
      type:"post",
      data: values,
      success:function(response)
      {
        $("#msgModal .modal-body p").html(response);
        $("#msgModal").modal("show");
      },
      error:function(response)
      {
        console.log(response);
          alert("error");
      }
    });
  }
});
$(document).on("click", ".deleteItem", function(){
  var serialno = $(this).find("a").attr("productid");
  var values={
    "serialno":serialno
  }
  $.ajax({
      url:urlVariable+"cinemax/api/admin_delete.php",
      type:"post",
      data: values,
      success:function(response)
      {
        $("#msgModal .modal-body p").html(response);
        $("#msgModal").modal("show");
      },
      error:function(response)
      {
        console.log(response);
          alert("error");
      }
  });
  
});
$(document).on("click", ".updateItem", function(){
  var serialno = $(this).find("a").attr("productid");
  localStorage.removeItem("updateitem");
  localStorage.setItem("updateitem", serialno);
  window.location.href = urlVariable+"cinemax/admin_update.html";
});

$(document).on("click", "#adminUpdateProduct", function(){
  var message="";
  var serialno=localStorage.getItem("updateitem");
  var moviename=$("#moviename").val();
  var image=$("#image").val();
  var cost=$("#cost").val();
  var availability=$("#availability").val();
  var numericReg = /^\d*[0-9](|.\d*[0-9]|,\d*[0-9])?$/;

  if(moviename=="" && image=="" && cost=="" && availability==""){
    message="Atleast one value should be entered";
    $("#result").html(message);
  }
  else {
    if(cost != "" && !numericReg.test(cost)){
      message="Invalid cost. Please enter numeric values only";
      $("#result").html(message);
    }
    else if(availability != "" && !numericReg.test(availability)){
      message="Invalid availability. Please enter numeric values only";
      $("#result").html(message);
    }
  }

  if(message==""){
    var values={
        "moviename":moviename,
        "image":image,
        "cost":cost,
        "availability":availability,
        "serialno":serialno
    }
    $.ajax({
        url:urlVariable+"cinemax/api/admin_update.php",
        type:"post",
        data: values,
        success:function(response)
        {
          $("#msgModal .modal-body p").html(response);
          $("#msgModal").modal("show");
          localStorage.removeItem("updateitem");
        },
        error:function(response)
        {
          console.log(response);
          alert("error");
          localStorage.removeItem("updateitem");
        }
    });
  }

});

$(document).on("click", "#gotoLogin", function(){
  window.location.href = urlVariable+"cinemax/login.html";
});
$(document).on("click", "#shopPageModal, #cartPageModal", function(){
  location.reload();
});
$(document).on("click", "#adminAddModal, #adminUpdateModal", function(){
  window.location.href = urlVariable+"cinemax/shop.html";
});

$(document).on("click", ".page-item", function(){
  $(this).parent().find("li.active").removeClass("active")
  $(this).addClass("active");
  var selectedSection = $(this).find("a").html();
  $(".pages").removeClass("active");
  $("#"+selectedSection).addClass("active");
  $(".pages").hide();
  $(".pages.active").show();
});