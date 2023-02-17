function get_browser()
{s=GetBrowser();s=s.split(' ');return s[0];}
function get_version()
{s=GetBrowser();s=s.split(' ');return s[1];}
function GetBrowser()
{var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[];if(/trident/i.test(M[1])){tem=/\brv[ :]+(\d+)/g.exec(ua)||[];return 'MSIE '+(tem[1]||'');}
if(M[1]==='Chrome'){tem=ua.match(/\bOPR\/(\d+)/)
if(tem!=null)return 'Opera '+tem[1];}
M=M[2]?[M[1],M[2]]:[navigator.appName,navigator.appVersion,'-?'];if((tem=ua.match(/version\/(\d+)/i))!=null)M.splice(1,1,tem[1]);return M.join(' ');}
function GetOS()
{var OSName="unknown";if(navigator.appVersion.indexOf("Win")!=-1)OSName="Windows";if(navigator.appVersion.indexOf("X11")!=-1)OSName="UNIX";if(navigator.appVersion.indexOf("Linux")!=-1)OSName="Linux";if(navigator.appVersion.indexOf("Mac")!=-1)OSName="MacOS";if(navigator.userAgent.match(/Android/i))OSName="Android";if(navigator.userAgent.match(/iPhone|iPad|iPod/i))OSName="iOS";return OSName;}
function GetFileName(file)
{i0=file.lastIndexOf('/');i1=file.lastIndexOf('\\');if(i0>i1)i1=i0;i1++;i2=file.lastIndexOf('.');name=file.substring(i1,i2)||file;return name;}
function GetFileExt(file)
{var ext=file.substring(file.lastIndexOf('.'));return ext;}