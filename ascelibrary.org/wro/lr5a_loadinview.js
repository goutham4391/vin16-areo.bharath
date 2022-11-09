
window.lazyLoad=function(selector,parentElement,ioptions,datasetAttr,callback){ioptions=ioptions||{root:null,rootMargin:"10%",threshold:0.3};var datasetItem;if(!datasetAttr){var regex=/data-(\w+[\-\w+]*)/g;var found=selector.match(regex)[0];datasetItem=found.substring(found.indexOf("data-")+5).replace(/(-\S)*/g,function(t){return t.toUpperCase()}).replace(/\-*/g,function(t){return t.replace("-","")})}else{datasetItem=datasetAttr;}
var baseElement;if(!parentElement){baseElement=document;}else if(typeof parentElement=="object"){baseElement=parentElement;}else{baseElement=document.querySelector(parentElement);}
var lazyImages=[].slice.call(baseElement.querySelectorAll(selector));if("IntersectionObserver"in window){var lazyImageObserver=new IntersectionObserver(function(entries,observer){entries.forEach(function(entry){if(entry.isIntersecting){var lazyImage=entry.target;observer.unobserve(lazyImage);lazyLoadLogic(lazyImage,datasetItem);}});},ioptions);lazyImages.forEach(function(lazyImage){lazyImageObserver.observe(lazyImage);});}else{var active=false;var lazyLoad=function(){if(active===false){active=true;setTimeout(function(){lazyImages.forEach(function(lazyImage){if((lazyImage.getBoundingClientRect().top<=window.innerHeight+(window.innerHeight*parseInt(ioptions["rootMargin"])/100)&&lazyImage.getBoundingClientRect().bottom>=0)&&getComputedStyle(lazyImage).display!=="none"){lazyLoadLogic(lazyImage,datasetItem);lazyImages=lazyImages.filter(function(image){return image!==lazyImage;});if(lazyImages.length===0){document.removeEventListener("scroll",lazyLoad);window.removeEventListener("resize",lazyLoad);window.removeEventListener("orientationchange",lazyLoad);}}});active=false;},200);}};if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',lazyLoad);}else{lazyLoad();}
document.addEventListener("scroll",lazyLoad);window.addEventListener("resize",lazyLoad);window.addEventListener("orientationchange",lazyLoad);}};function guidGenerator(){var S4=function(){return(((1+Math.random())*0x10000)|0).toString(16).substring(1);};return(S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());}
function lazyLoadLogic(lazyImage,dataAttrbiute){var data=parseJson(lazyImage.dataset[dataAttrbiute]);switch(data.type){case"image":if(data.src.length>0){lazyImage.src=data.src;lazyImage.removeAttribute("data-"+dataAttrbiute);}
break;case"mathjax":var sel=data.selector||'.NLM_disp-formula';var closest=lazyImage.closest(sel);if(closest.id===""){var id=guidGenerator();closest.setAttribute('id',id);}
lazyImage.remove();MathJax.Hub.Queue(["Typeset",MathJax.Hub,closest.id]);if(typeof callback==='function')callback.call(this);break;case"sketchfab":var url=lazyImage.dataset["url"];var image=lazyImage.querySelector('a.thumbnail');var request=new XMLHttpRequest();lazyImage.removeAttribute("data-url");request.open("GET",url,true);request.onload=function(){if(request.status!=200)return;responseAsJson=JSON.parse(request.responseText);replaceImageWith3DIframe(responseAsJson.html,image,lazyImage);};request.send();break;case"backgroundImage":var url="url('"+data.src+"')";lazyImage.style.backgroundImage=url;break;case"addClass":lazyImage.classList.add(data.className);break;default:}}
function insertAfterNode(newNode,referenceNode){if(referenceNode.parentNode.getElementsByClassName("sketchfab-embed-wrapper").length===0)
referenceNode.insertAdjacentHTML('afterend',newNode);}
function replaceImageWith3DIframe(data,image,current){if(data){var figureDownloadOption=current.querySelector(".figureDownloadOptions");figureDownloadOption.style.display="none";image.style.display="none";insertAfterNode(data,current.querySelector(".figureInfo"));var iframe=current.querySelector('iframe');var width=iframe.offsetWidth;iframe.style.height=(width*9/16);}}
function parseJson(str){var jsonObject;try{jsonObject=JSON.parse(str)}catch(e){jsonObject=JSON.parse("{\"type\":\"image\" , \"src\":\""+str+"\"}");}
return jsonObject;};