	var img, canvas;
	var xcan,ycan,xcan0,ycan0;
	var click_count=0,x1,y1,x2,y2;
	var os,browser;
	
	window.onload = function()
	{
		var os = GetOS();


		var imgdiv1 = document.getElementById('imgdiv1');
		var imgdiv2 = document.getElementById('imgdiv2');

		canvas = GetCanvas();
		canvas.style.display = 'none';

		browser =  get_browser();
		if( browser=='Chrome' )
		{
			imgdiv2.style.display = 'none';
			imgdiv1.style.display = '';
		}
		else if( browser=='Firefox' )
		{
			imgdiv1.style.display = 'none';
			imgdiv2.style.display = '';
			imgdiv2.focus();
		}
		else
		{
			imgdiv2.style.display = 'none';
			imgdiv1.style.display = '';
			alert('Pixel ruler may not be supported with this browser\nPlease try with Chrome or Firefox');
		}

		if( browser=='Firefox' )
		{
			document.onpaste = function(event)
			{
				var Draw2 = function()
				{
					img = GetImage();
					if(!img) img = this;
				    var canvas = GetCanvas();
					MAX_WIDTH = document.getElementById('resize').value;
					Multi=canvas.width/MAX_WIDTH;
					MultiW=canvas.width/Multi;
					MultiH=canvas.height/Multi;
				    canvas.width = Math.round(MultiW);
					canvas.height = Math.round(MultiH);
					canvas.style.width  = Math.round(MultiW)+'px';
					canvas.style.height = Math.round(MultiH)+'px';
					canvas.getContext("2d").drawImage(img, 0, 0,canvas.width, canvas.height);
				    canvas.style.cursor = "crosshair"; //"default"
					xcan0 = xcan = Math.round(MultiW);
					ycan0 = ycan = Math.round(MultiH);
					img.style.display='none';
					canvas.style.display='';
					document.getElementById('isize').innerHTML = "W: "+xcan+" &times; H: "+ycan;
					ratio=xcan/ycan;
					document.getElementById('ratio').style.color = "grey";
					document.getElementById('resizenew').style.color = "grey";
					if (ratio>1.1 && ratio<1.6)
					{
					document.getElementById('ratio').value="4:3";
					}
					else if (ratio>1.6 && ratio<1.9)
					{
					document.getElementById('ratio').value="16:9";
					}
					else
					{
					document.getElementById('ratio').value="N/A";
					}
				};
				//img = GetImage();
			    //if(img.complete)
			    //	Draw2();
			    //else
			    //	img.onload = Draw2;
			    setTimeout( Draw2, 300 );
			};
		}
		else
		{
			document.onpaste = function(event)
			{
				// use event.originalEvent.clipboard for newer chrome versions
				var clipboardData = event.clipboardData || event.originalEvent.clipboardData;
				var items = clipboardData.items;
				console.log(JSON.stringify(items)); // will give you the mime types
				// find pasted image among pasted items
				var blob;
				for (var i = 0; i < items.length; i++)
				{
					if (items[i].type.indexOf("image") === 0)
					{
						blob = items[i].getAsFile();
					}
				}
				// load image if there is a pasted image
				if (blob !== null)
				{
					var reader = new FileReader();
					reader.onload = function(event)
					{
						//console.log(event.target.result); // data url!
						img = document.getElementById("pastedImage");
						img.src = event.target.result;
						if( img.complete )
							DrawCanvas(0);
						else
							img.onload = function() { DrawCanvas(0); };
					};
					
					reader.readAsDataURL(blob);
				}
			};
						
		}

		canvas.onmousedown = function(event) {
			if( click_count==0 )
			{
				click_count++;
				canvas = GetCanvas();
				p = GetPos(canvas, event);
				ctx = canvas.getContext("2d");
			    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				x1 = p.x*xcan0/xcan;
				y1 = p.y*ycan0/ycan;
			}
		};

		canvas.onmouseup = function(event) {
			if( click_count==1 )
			{
				canvas = GetCanvas();
				p = GetPos(canvas, event);
				x = p.x*xcan0/xcan;
				y = p.y*ycan0/ycan;
				if( x!=x1 && y!=y1 )
				{
					click_count++;
					click_count = 0;
				}
			}
		};
		

		canvas.onmousemove = function(event) {
				
			if( click_count==1 && document.getElementById('mode').value =="1")
			{
				canvas = GetCanvas();
				p = GetPos(canvas, event);
				x2 = p.x*xcan0/xcan;
				y2 = p.y*ycan0/ycan;
				if( x2>x1 )
				{
					x1 = Math.floor(x1);
					x2 = Math.ceil(x2);
				}
				else if( x2<x1 )
				{
					x2 = Math.floor(x2);
					x1 = Math.ceil(x1);
				}
				else
				{
					x1 = Math.round(x1);
					x2 = Math.round(x2);
				}
				if( y2>y1 )
				{
					y1 = Math.floor(y1);
					y2 = Math.ceil(y2);
				}
				else if( y2<y1 )
				{
					y2 = Math.floor(y2);
					y1 = Math.ceil(y1);
				}
				else
				{
					y1 = Math.round(y1);
					y2 = Math.round(y2);
				}
				img = GetImage();
				DrawCanvas(1);
				ctx = canvas.getContext("2d");
				//ctx.setLineDash([5]);
				ctx.lineWidth=1;
				ctx.strokeStyle="FF0000";
			    ctx.beginPath();
			    ctx.moveTo(x1,y1);
			    ctx.lineTo(x2,y2);
			    ctx.stroke();
				ctx.lineWidth=3;
				ctx.strokeStyle="#fae505";
				//ctx.setLineDash([5]);
			    ctx.beginPath();
			    ctx.rect(x1,y1,x2-x1,y2-y1);
			    ctx.stroke();
				dx = Math.abs(x2-x1);
				dy = Math.abs(y2-y1);
				//ddd = Math.round(Math.sqrt(dx*dx+dy*dy))+'';
				ddd=Math.round(dx/document.getElementById('rotakin').value);
				document.getElementById('size').value = 'X: '+dx+' Y: '+dy;
				document.getElementById('size').style.color = "grey";
				document.getElementById('size').style.color = "grey";
				NewLenResize=ddd/document.getElementById('lennew').value;
				
				
				document.getElementById('resizenew').value=newres(NewLenResize);
				
				
				document.getElementById('len').style.backgroundColor = "white";
				document.getElementById('len1').style.color = "white";
				if (ddd<=24 && ddd>=13)
				{
				document.getElementById('len').style.color = "blue";
				document.getElementById('len').value = 'Monitoring';
				document.getElementById('len1').value = ddd;
					if (document.getElementById('lennew').value == 13)
					{
					document.getElementById('len2').value = "20";
					}
				}
				else if (ddd<=62 && ddd>=25)
				{
				document.getElementById('len').style.color = "green";

				document.getElementById('len').value = 'Detection';
				document.getElementById('len1').value = ddd;
					if (document.getElementById('lennew').value == 25)
					{
					document.getElementById('len2').value = "40";
					}
				}
				else if (ddd<=124 && ddd>=63)
				{
				document.getElementById('len').style.color = "orange";

				document.getElementById('len').value = 'Observation';
				document.getElementById('len1').value = ddd;
					if (document.getElementById('lennew').value == 63)
					{
					document.getElementById('len2').value = "100";
					}
				}
				else if (ddd==150)
				{
				document.getElementById('len').style.color = "magenta";

				document.getElementById('len').value = 'NP Recognition';
				document.getElementById('len1').value = ddd;
					if (document.getElementById('lennew').value == 150)
					{
					document.getElementById('len2').value = "80";
					}
				}
				else if (ddd!=150 && ddd>=125 && ddd<=249)
				{
				document.getElementById('len').style.color = "magenta";

				document.getElementById('len').value = 'Recognition';
				document.getElementById('len1').value = ddd;
					if (document.getElementById('lennew').value == 125)
					{
					document.getElementById('len2').value = "200";
					}
				}
				
				else if (ddd>=250)
				{
				document.getElementById('len').style.color = "red";

				document.getElementById('len').value = 'Identification';
				document.getElementById('len1').value = ddd;
					if (document.getElementById('lennew').value == 250)
					{
					document.getElementById('len2').value = "400";
					}
				}
				else
				{
				document.getElementById('len').style.color = "black";
				document.getElementById('len').value = 'Incompliance';
				document.getElementById('len').style.backgroundColor = "red";
				document.getElementById('len1').value = ddd;
				document.getElementById('len2').value = "9999";
				}
				document.getElementById('len2').style.color = "white";
				if (dy<document.getElementById('len2').value)
				{
				document.getElementById('len2').style.backgroundColor = "red";
				}
				else
				{
				document.getElementById('len2').style.backgroundColor = "green";
				}
				lennew=document.getElementById('lennew').value*1.5;
				console.log (lennew);
				if (document.getElementById('lennew').value>ddd || ddd>lennew)
				{
				document.getElementById('len1').style.backgroundColor = "red";
				}
				else
				{
				document.getElementById('len1').style.backgroundColor = "green";
				}
			}
			else if ( click_count==1 && document.getElementById('mode').value =="2")
			{
				canvas = GetCanvas();
				p = GetPos(canvas, event);
				x2 = p.x*xcan0/xcan;
				y2 = p.y*ycan0/ycan;
				img = GetImage();
				DrawCanvas(1);
				ctx = canvas.getContext("2d");
				ctx.beginPath();
				ctx.lineWidth=3;
				ctx.strokeStyle="#fae505";
				TargetM=document.getElementById('rotakin').value*document.getElementById('lennew').value;
				if (document.getElementById('lennew').value == 13)
					{
					ctx.rect(x1,y1, TargetM, 20);
					ctx.stroke();
					}
				else if (document.getElementById('lennew').value == 25)
					{
					ctx.rect(x1,y1, TargetM, 40);
					ctx.stroke();
					}
				else if (document.getElementById('lennew').value == 63)
					{
					ctx.rect(x1,y1, TargetM, 100);
					ctx.stroke();
					}
				else if (document.getElementById('lennew').value == 125)
					{
					ctx.rect(x1,y1, TargetM, 200);
					ctx.stroke();
					}
				else if (document.getElementById('lennew').value == 250)
					{
					ctx.rect(x1,y1, TargetM, 400);
					ctx.stroke();
					}
				else if (document.getElementById('lennew').value == 150)
					{
					ctx.rect(x1,y1, TargetM, 80);
					ctx.stroke();
					}					
			}
			
		};

		DrawCanvas(0);
		ZoomOut();
		ZoomOut();
		ZoomOut();
		ZoomOut();
		ZoomOut();
		ZoomOut();
		
	};
	function newres (res)
	{
		sized=Math.round(document.getElementById('resize').value/res);
		ratio=document.getElementById('ratio').value;
		if (sized<160)
		{
			sized="N/A";
		}
		else if (sized>=160 && sized<320) 
		{
			sized="160 "+document.getElementById('ratio').value;
		}
		else if (sized>=320 && sized<480) 
		{
			sized="320 "+document.getElementById('ratio').value;
		}
		else if (sized>=480 && sized<640) 
		{
			sized="480 "+document.getElementById('ratio').value;
		}
		else if (sized>=640 && sized<800) 
		{
			sized="640 "+document.getElementById('ratio').value;
		}
		else if (sized>=800 && sized<854 && ratio=="16:9") 
		{
			sized="800 "+document.getElementById('ratio').value;
		}
		else if (sized>=854 && sized<1280 && ratio=="16:9") 
		{
			sized="854 "+document.getElementById('ratio').value;
		}
		else if (sized>=1280 && sized<1920 && ratio=="16:9") 
		{
			sized="1280 "+document.getElementById('ratio').value;
		}
		else if (sized>=1920 && sized<2560 && ratio=="16:9") 
		{
			sized="1920 "+document.getElementById('ratio').value;
		}
		else if (sized>=800 && sized<1024 && ratio!=="16:9") 
		{
			sized="800 "+document.getElementById('ratio').value;
		}
		else if (sized>=1024 && sized<1280 && ratio!=="16:9") 
		{
			sized="1024 "+document.getElementById('ratio').value;
		}
		else if (sized>=1280 && sized<1440 && ratio=="16:10") 
		{
			sized="1280 "+document.getElementById('ratio').value;
		}
		else if (sized>=1280 && sized<1400 && ratio=="4:3") 
		{
			sized="1280 "+document.getElementById('ratio').value;
		}
		else if (sized>=1400 && sized<1440 && ratio=="4:3") 
		{
			sized="1400 "+document.getElementById('ratio').value;
		}
		
		return sized;
	
	}
	function GetPos(obj, e)
	{
	    var totalOffsetX = 0;
	    var totalOffsetY = 0;
	    var currentElement = obj;
	
		if( browser=='Chrome' )
		{
			x = event.offsetX;
			y = event.offsetY;
		}
		else
		{
		    do 
		    {
		        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
		        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
		    }
		    while(currentElement = currentElement.offsetParent)
		
		    x = e.pageX - totalOffsetX;
		    y = e.pageY - totalOffsetY;
		}
			
		return {x:x, y:y};
	}
	function DrawCanvas(f)
	{
		img = GetImage();
	    canvas = GetCanvas();
	    
	    canvas.style.cursor = "crosshair"; //"default"
		if( f==0 )
		{
			MAX_WIDTH = document.getElementById('resize').value;
			Multi=img.width/MAX_WIDTH;
			MultiW=Math.round(img.width/Multi);
			MultiH=Math.round(img.height/Multi);
			canvas.width = MultiW;
			canvas.height = MultiH;
			canvas.style.width  = MultiW+'px';
			canvas.style.height = MultiH+'px';
			xcan0 = xcan = MultiW;
			ycan0 = ycan = MultiH;
			document.getElementById('isize').innerHTML = "W: "+xcan+" &times; H: "+ycan;
			document.getElementById('resizenew').style.color = "grey";
			ratio=xcan/ycan;
			document.getElementById('ratio').style.color = "grey";
			if (ratio>1.1 && ratio<1.5)
			{
			document.getElementById('ratio').value="4:3";
			}
			else if (ratio>=1.5 && ratio<1.7)
			{
			document.getElementById('ratio').value="16:10";
			}
			else if (ratio>=1.7 && ratio<1.9)
			{
			document.getElementById('ratio').value="16:9";
			}
			else
			{
			document.getElementById('ratio').value="N/A";
			}
		}
		else
		{
			x = Math.round(xcan);
			y = Math.round(ycan);
			canvas.style.width  = x+'px';
			canvas.style.height = y+'px';
		}
		
		canvas.getContext("2d").drawImage(img, 0, 0,canvas.width, canvas.height);
		canvas.style.display = '';
		img.style.display='none';
		//canvas.getContext("2d").save();
	}
	
	function ZoomOut()
	{
		canvas = GetCanvas();
		xcan*=0.9;
		ycan*=0.9;
		x = Math.round(xcan);
		y = Math.round(ycan);
		canvas.style.width  = x+'px';
		canvas.style.height = y+'px';
	}
	function ZoomIn()
	{
		canvas = GetCanvas();
		xcan/=0.9;
		ycan/=0.9;
		x = Math.round(xcan);
		y = Math.round(ycan);
		canvas.style.width  = x+'px';
		canvas.style.height = y+'px';
	}
	
	function GetImage()
	{
		var img;
		if( browser=='Firefox' )
		{
			//img = document.getElementsByTagName("img")[5];
			arr = document.getElementsByTagName("img");
			len = arr.length;
			img = arr[len-1];
		}
		else
			img = document.getElementById('pastedImage');
		return img;
	}
	function GetCanvas()
	{
		var can;
		if( browser=='Firefox' )
			can = document.getElementById('can2');
		else
			can = document.getElementById('can');
		return can;
	}
	function Paste()
	{
		os = GetOS();
		if( os=="UNIX" )
			alert("Press Ctrl+Shift+V to paste image");
		else if( os=="MacOS" )
			alert("Press Command+V to paste image");
		else if( os=="iOS" )
			alert("Tap on entry field and press the paste button to paste image");
		else if( os=="Android" )
			alert("Press Menu+V or long tap on entry field and press the paste button to paste image");
		else
			alert("Press Ctrl+V to paste image with new resolution");
	}
	function Save()
	{
		var img = GetImage();
		canvas = GetCanvas();
		if( canvas.style.display == 'none' ) return;
		
		document.getElementById("getFilename").style.display = "";
		
		return false;
	}
	function Delete()
	{
		canvas = GetCanvas();
		canvas.style.display = 'none';
		if( browser=='Firefox' )
		{
			var img = GetImage();
			img.parentNode.removeChild(img);
			var imgdiv2 = document.getElementById('imgdiv2');
			imgdiv2.focus();
		}
		document.getElementById('len').value = '';
		document.getElementById('size').value = '';
		click_count = 0;
	}
	function cancelSaveFile()
	{
		document.getElementById("getFilename").style.display = "none";
	}
	function saveFile()
	{
		cancelSaveFile();
		var name = document.getElementById("filename").value;
		if( name=='' ) name='filename.png';
		
		var img = GetImage();
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext("2d").drawImage(img, 0, 0);
		
		canvas.toBlob(function(blob) {
    		saveAs(blob, name);
		});	}