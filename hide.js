function Hide() {
  var x = document.getElementById("block2");
  var y = document.getElementById("block3");
  var z = document.getElementById("block4");
    if (x.style.display === "none") {
    x.style.display = "block";
	    y.style.display = "block";
		    z.style.display = "block";
  } else {
    x.style.display =  "none";
	    y.style.display =  "none";
		    z.style.display =  "none";
  }
}