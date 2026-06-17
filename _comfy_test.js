var http=require("http");
var fs=require("fs");

function apiPost(path,data){
  return new Promise(function(res,rej){
    var b=JSON.stringify(data);
    var r=http.request({hostname:"127.0.0.1",port:8188,path:path,method:"POST",headers:{"Content-Type":"application/json","Content-Length":Buffer.byteLength(b)}},function(r){
      var d="";r.on("data",function(c){d+=c});r.on("end",function(){res(JSON.parse(d))});
    });
    r.on("error",rej);
    r.end(b);
  });
}

function apiGet(path){
  return new Promise(function(res,rej){
    http.get({hostname:"127.0.0.1",port:8188,path:path},function(r){
      var d=[];r.on("data",function(c){d.push(c)});r.on("end",function(){res(Buffer.concat(d))});
    }).on("error",rej);
  });
}

// Generate a test image with Juggernaut XL
var workflow = {
  "3":{"class_type":"KSampler","inputs":{"seed":Math.floor(Math.random()*1000000),"steps":20,"cfg":7,"sampler_name":"euler","scheduler":"normal","denoise":1,"model":["4",0],"positive":["6",0],"negative":["7",0],"latent_image":["5",0]}},
  "4":{"class_type":"CheckpointLoaderSimple","inputs":{"ckpt_name":"juggernautXL_version6Rundiffusion.safetensors"}},
  "5":{"class_type":"EmptyLatentImage","inputs":{"width":1216,"height":832,"batch_size":1}},
  "6":{"class_type":"CLIPTextEncode","inputs":{"text":"photorealistic desk setup photo, warm minimalist workspace, natural lighting, bamboo desk, clean organized, professional photography, 8k, highly detailed","clip":["4",1]}},
  "7":{"class_type":"CLIPTextEncode","inputs":{"text":"blurry, low quality, cartoon, anime, watermark, text, bad lighting, dark, messy","clip":["4",1]}},
  "8":{"class_type":"VAEDecode","inputs":{"samples":["3",0],"vae":["4",2]}},
  "9":{"class_type":"SaveImage","inputs":{"filename_prefix":"outech_test","images":["8",0]}}
};

async function main(){
  console.log("Sending prompt...");
  var r=await apiPost("/prompt",{prompt:workflow});
  var pid=r.prompt_id;
  console.log("Prompt queued: "+pid);
  
  // Wait for completion
  for(var i=0;i<120;i++){
    await new Promise(function(r){setTimeout(r,1000)});
    try{
      var h=await apiGet("/history/"+pid);
      var hj=JSON.parse(h.toString());
      if(hj[pid]){
        var out=hj[pid].outputs;
        for(var k in out){
          if(out[k].images){
            var img=out[k].images[0];
            console.log("Generated: "+img.filename);
            var view=await apiGet("/view?filename="+encodeURIComponent(img.filename)+"&type=output&format=webp");
            console.log("Image size: "+view.length+" bytes");
            fs.writeFileSync("C:\\Users\\Deniz\\Documents\\赚钱-每天睡后收入\\blog_test.webp",view);
            console.log("Saved!");
            return;
          }
        }
      }
    } catch(e){}
  }
  console.log("Timeout");
}

main().catch(console.error);
