// ------------------------
// Set global variables
// ------------------------         
      var colourMaskSet = 'notset';
      var threshMask = 'notset';
      var threshold;
      var R;  //for colour mask
      var G;  //for colour mask
      var B;  //for colour mask
      var setR; //for colour colourise
      var setG; //for colour colourise
      var setB;       //for colour colourise    
      var myImageData; 
      var newImageData;  
      var pixelComponents;
      var idx; 
      var convolutionWidth;
      var convolutionHeight;
      var convolutionMask;
      var factor; 
      var bias ;
      var convolutionKernel_OutputArraySize;
      var convolutionKernel_Output;
      var increment;
	var colour;
	var rainbowRGB = [[255,0,0],
[255,13,0],
[255,26,0],
[255,39,0],
[255,52,0],
[255,65,0],
[255,78,0],
[255,91,0],
[255,104,0],
[255,117,0],
[255,130,0],
[255,143,0],
[255,156,0],
[255,169,0],
[255,182,0],
[255,195,0],
[255,208,0],
[255,221,0],
[255,234,0],
[255,247,0],
[250,255,0],
[237,255,0],
[224,255,0],
[211,255,0],
[198,255,0],
[185,255,0],
[172,255,0],
[159,255,0],
[146,255,0],
[133,255,0],
[120,255,0],
[107,255,0],
[94,255,0],
[81,255,0],
[68,255,0],
[55,255,0],
[42,255,0],
[29,255,0],
[16,255,0],
[3,255,0],
[0,255,10],
[0,255,23],
[0,255,36],
[0,255,49],
[0,255,62],
[0,255,75],
[0,255,88],
[0,255,101],
[0,255,114],
[0,255,127],
[0,255,140],
[0,255,153],
[0,255,166],
[0,255,179],
[0,255,192],
[0,255,205],
[0,255,218],
[0,255,231],
[0,255,244],
[0,253,255],
[0,240,255],
[0,227,255],
[0,214,255],
[0,201,255],
[0,188,255],
[0,175,255],
[0,162,255],
[0,149,255],
[0,136,255],
[0,123,255],
[0,110,255],
[0,97,255],
[0,84,255],
[0,71,255],
[0,58,255],
[0,45,255],
[0,32,255],
[0,19,255],
[0,6,255],
[7,0,255],
[20,0,255],
[33,0,255],
[46,0,255],
[59,0,255],
[72,0,255],
[85,0,255],
[98,0,255],
[111,0,255],
[124,0,255],
[137,0,255],
[150,0,255],
[163,0,255],
[176,0,255],
[189,0,255],
[202,0,255],
[215,0,255],
[228,0,255],
[241,0,255],
[254,0,255]
];


	var linecount = [0,0];


var size    = 30;
var rainbow = new Array(size);

for (var i=0; i<size; i++) {
  var red   = sin_to_hex(i, 0 * Math.PI * 2/3); // 0   deg
  var blue  = sin_to_hex(i, 1 * Math.PI * 2/3); // 120 deg
  var green = sin_to_hex(i, 2 * Math.PI * 2/3); // 240 deg

  rainbow[i] = "#"+ red + green + blue;
}

function sin_to_hex(i, phase) {
  var sin = Math.sin(Math.PI / size * 2 * i + phase);
  var int = Math.floor(sin * 127) + 128;
  var hex = int.toString(16);

  return hex.length === 1 ? "0"+hex : hex;
}

// ------------------------
// Display options
// ------------------------

function divDisplay() {
  var selection = document.getElementById("effect").value;    
      if(selection == "sepia") 
        {colourSel.style.display = "block";}
     else  
        {colourSel.style.display = "none";} 
            
     if(selection == "boxBlur"
        || selection == "gausian"
        || selection == "motionBlur"
        ||selection == "sobel"
        || selection == "robertsCross"
        || selection == "sharpen"
        || selection == "emboss"
        || selection == "emboss45"
        || selection == "canny"
         ) 
           {biasSel.style.display = "block";}
        else  
           { biasSel.style.display = "none";} 
                                    
      if(selection == "sobel"
         || selection == "thresholdEffect"
         || selection == "robertsCross"
         || selection == "sharpen"
         || selection == "canny"                 
         ) 
           { thresholdSel.style.display = "block";}
       else  
           {thresholdSel.style.display = "none";}  
}

function resetOptions(){   
        R = 0;
        G = 0;
        B = 0;
        setR = 0; 
        setG = 0; 
        setB = 0; 
        document.getElementById("thresh").value = 0; 
        document.getElementById("bias").value = 0; 
        document.getElementById("colorMask").value = "#000000";
        document.getElementById("setColour").value = "#000000";
        document.getElementById("maskThresh").value = 127.5;
        document.getElementById("colThresh").value = 75;        
}

// ------------------------
// Upload images  form default or file
// ------------------------          
var mySrcImg = new Image();
mySrcImg.src = "demo.jpg";   
// mySrcImg.src = "example42.bmp";     

mySrcImg.addEventListener('load', function () {loadImg();}, false);

function addLoadEventToFileSelect() {
 document.getElementById("files").addEventListener('change',loadFile,false);
}
 
function loadFile(evt){
        var files = evt.target.files;
        var fileSelected = files[0];
          if(!fileSelected.type.match('image.*'))
            {return;}
       var reader = new FileReader();
         reader.onload =(function(theFile){
         return function (e) {
          document.getElementById("outputImage").innerHTML =
          "<img src =\"" + e.target.result + "\" alt=\"Image from file\" id=\"imgOutput\" width =\"50%\" ><input type=\"button\" id=\"clickMe\" Value=\"Process Image\" onClick=\"srcImg()\"/>";
         };
         })(fileSelected);
        reader.readAsDataURL(fileSelected);
}

function srcImg() {
        var tmpImg = document.getElementById("imgOutput");
        mySrcImg.src = tmpImg.src;
        loadImg()
}

function loadImg() {
          var canvas=document.getElementById("canvas");
          var context=canvas.getContext("2d");  
          if (!context|| !context.getImageData ||!context.putImageData||!context.drawImage){
            rerurn;
          }
          canvas.width = mySrcImg.width;
          canvas.height = mySrcImg.height;        
          context.drawImage(mySrcImg,0,0);
          
             myImageData;
            try {
                myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
                } catch (e){
                netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
                myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
                }
          context.putImageData(myImageData, 0,0);
          var result = document.getElementById("resultimg");
          result.src = canvas.toDataURL(); 
        }
        

// ------------------------
// Masking functions
// ------------------------  
function  setThreshMask(set) { threshMask = set;
            if(set == "setOver"||set == "setUnder") 
                 { setThreshMaskDiv.style.display = "block";}
             else  
                 {setThreshMaskDiv.style.display = "none";} 
          }   
function  setColourMask(set) {
            colourMaskSet = set;
            if(set == "set") 
                 { setColourMaskDiv.style.display = "block";}
             else  
                 {setColourMaskDiv.style.display = "none";} 
          }              

// convert the hex values in to rgb when selected from picker and set as mask.
function  setColourForMask() { 
          var colour = document.getElementById("colorMask").value;
          function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
          function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
          function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
          function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h} 
          R = hexToR(colour);
          G = hexToG(colour);
          B = hexToB(colour);
          }
          
function  colourMask(pixelComponents, i){
             var colVary = document.getElementById("colThresh").value;  
              if((R-colVary < pixelComponents [i] && pixelComponents [i] < R+colVary)  &&
                  (G-colVary < pixelComponents [i+1] && pixelComponents [i+1] < G+colVary) &&
                  (B-colVary < pixelComponents [i+2] && pixelComponents [i+2] < B+colVary)) 
                  {
                  if (document.getElementById("invertColourMask").checked) 
                    {return false }else{return true}
                  }else{
                  if (document.getElementById("invertColourMask").checked) 
                    {return true }else{return false}
                  }   
              }  

// ------------------------
// Set options
// ------------------------                        
function  setColourOption() {      
          var colour = document.getElementById("setColour").value;
          function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
          function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
          function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
          function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h} 
          setR = hexToR(colour);
          setG = hexToG(colour);
          setB = hexToB(colour);
          }                                              
// ------------------------
// Main Image Processing 
// ------------------------   
function  change(){
      //alert ("Start pixel processing.");  
          var canvas=document.getElementById("canvas");
          var context=canvas.getContext("2d");  
          var process = document.getElementById("effect").value;
            try {
                myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
                newImageData = context.getImageData(0, 0,canvas.width, canvas.height); 
                } catch (e){
                netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
                myImageData = context.getImageData(0, 0, canvas.width, canvas.height); 
                newImageData = context.createImageData(0, 0, canvas.width, canvas.height);
                }
          pixelComponents = newImageData.data;
			linecount[0]= Math.floor(Math.random() * 97);  
      var direction = 1 
// loop through rows and columns        
         for (var x = 0; x < canvas.width; x++) {
		        if (linecount[1]>canvas.width/96){
			         linecount[1] = 0;
			         linecount[0] = linecount[0]+direction;
				        }
				if (linecount[0]>96){
           direction = -1
				  }
        else if (linecount[0]==0){
            direction = 1
            }
          setR = rainbowRGB [ linecount[0]][0];
          setG = rainbowRGB [ linecount[0]][1];
          setB = rainbowRGB [ linecount[0]][2];
										
		  linecount[1] = linecount[1]+1;
			

          for (var y = 0; y < canvas.height; y++) {
// align row column coordinates with one dimsional array                    
           idx = (x + y * canvas.width)*4;
           
// apply selected mask              
            var masked = false;   
             if(colourMaskSet == 'set')    
             { masked = colourMask(pixelComponents,idx);}
             if(threshMask == 'setOver')    
             {if ((pixelComponents[idx] + pixelComponents[idx+1] + pixelComponents[idx+2]) /3 > 0+Number(document.getElementById("maskThresh").value))
             {masked = true;}}
             if(threshMask == 'setUnder')    
             {if ((pixelComponents[idx] + pixelComponents[idx+1] + pixelComponents[idx+2]) /3 < 0+Number(document.getElementById("maskThresh").value))
             {masked = true;} }

              if(!masked) 
                      {                     
                      if(process == 'unicorn')    {unicorn();} 
                      if(process == 'grayscaleLuminosity')    {grayscaleLuminosity(x,y,canvas.width,canvas.height );} 
                         

                    }         
       }
      }   
     // alert ("Finished pixel processing."); 
          context.putImageData(myImageData, 0,0);
          context.putImageData(newImageData, 0,0);
   
                    var result = document.getElementById("resultimg");
          result.src = canvas.toDataURL();           
 }




// ------------------------
// Simple Pixel Processing 
// -----------------------

function  unicorn(){
          pixelComponents[idx ] = pixelComponents[idx ]+setR/1.5; 
          pixelComponents[idx+1] = pixelComponents[idx+1]+setG/1.5; 
          pixelComponents[idx+2] = pixelComponents[idx+2]+setB/1.5;      
      }

function  grayscaleLuminosity(){
          var avg = (0.3*pixelComponents [idx]) + (0.59*pixelComponents [idx+1]) + (0.11*pixelComponents [idx+2]);
          pixelComponents[idx ] = avg; 
          pixelComponents[idx+1] = avg; 
          pixelComponents[idx+2] = avg;   
      }  
    