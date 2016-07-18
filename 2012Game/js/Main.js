var soundplayer = document.getElementById('soundplayer');
var canvas = document.getElementById('myCanvas');
var div = document.getElementById('d');
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#FFFFFF';
//var height = window.screen.height;
//var width = window.screen.width;
var height = canvas.height;
var width = canvas.width;
var midx = width / 2;
var midy = height / 2;
var longest=Math.sqrt(midx*midx+midy*midy);
var moonr = 20;
var earthr = 80;
var hiterr = 25;
var mindistance = 90;
var maxdistance = (midy - moonr)/Math.sqrt(2);
var distance = mindistance;
var monnangle = 0;
var paddid=-1;
var predid=-1;
var clicked = false;
var g2 = Math.sqrt(2);
var soundflag = true;
var Score = window.localStorage.getItem("High");
if (Score == null)
    Score = 0;
var hitertime = 1000;

var imgearth = new Image();
imgearth.src = "images/realmap.png";
var imghiter = new Image();
imghiter.src = "images/hiter.png";
var imgmoon = new Image();
imgmoon.src = "images/moon.png";
var bg = new Image();
bg.onload = function () {
    ctx.drawImage(bg, 0, 0);
    //imgDat = ctx.getImageData(0, 0, canvas.width, canvas.height);

}
bg.src = "images/bg.jpg";
var imgcontinue = new Image();
imgcontinue.src = "images/continue.png";
var imgpause = new Image();
imgpause.src = "images/pause.png";
var imghome = new Image();
imghome.src = "images/home.png";
var imgpausebg = new Image();
imgpausebg.src = "images/pausebg.png";
var imgrepaly = new Image();
imgrepaly.src = "images/replay.png";
var imgend = new Image();
imgend.src = "images/end.png";
var imghiterboom = new Image();
imghiterboom.src = "images/boom.png";
var imgsound = new Image();
imgsound.src = "images/sound.png";
var imgnosound = new Image();
imgnosound.src = "images/nosound.png";
var imghead = new Image();
imghead.src = "images/head.png";
var img2012 = new Image();
img2012.src = "images/2012.png";
var imgsnap = new Image();
imgsnap.src = "images/snapview.png";

var mlist = new MetList();
var end=false;
var pause = false;
var drawid=-1;
var mearth = new Earth(243,earthr,imgearth);
var roadqueue = new RoadQueue();

var isstart = false;
var imgstart = new Image();
imgstart.src="images/start.png";
var bstartr = 250;
var startearth = new Earth(761, bstartr, imgstart);
var bstart = new RoundButton(midx, midy, bstartr);
var bssound;
if(soundflag)
    bssound = new ImageButton(0, height - 60, 60, 60, imgsound);
else
    bssound = new ImageButton(0, height - 60, 60, 60, imgnosound);

var nowtime = 0;

var metcomeid = -1;

var pp = new pausepanel();
initial();

var bpause = new ImageButton(width - 60, 0, 60, 60, imgpause);
var bend = new ImageButton(midx - earthr, midy - earthr, earthr * 2, earthr * 2, imgend);
var grade = 0;
var starting = false;
var startangle = 225;
var startpause = false;
function initilvars() {
    startpause = false;
    startangle = 225;
    starting = false;
    Score = window.localStorage.getItem("High");
    if (Score == null)
        Score = 0;
    end=false;
    grade = 0;
    nowtime = 0;
    clearallp();
    ctx.fillStyle = '#FFFFFF';
    mindistance = 90;
    maxdistance = (midy - moonr) / Math.sqrt(2);
    distance = mindistance;
    monnangle = 0;
    clicked = false;
    g2 = Math.sqrt(2);

    hitertime = 1000;

    mlist = new MetList();

    pause = false;
    //mearth = new Earth(243, earthr, imgearth);
    roadqueue = new RoadQueue();

    bstartr = 250;
    startearth = new Earth(760, bstartr, imgstart);
    bstart = new RoundButton(midx, midy, bstartr);

    bcontinue = new ImageButton(midx - 60, midy - 60, 120, 120, imgcontinue);
}
function initial() {
    div.innerHTML = "";
    canvas.addEventListener("mousedown", intichose, false);
    welcome();
}
function intichose(e) {
    var rx;
    var ry;
    if (e.pageX || e.pageY) {
        rx = e.pageX;
        ry = e.pageY;
    }
    else {
        rx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        ry = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    rx -= canvas.offsetLeft;
    ry -= canvas.offsetTop;

    if (bstart.isclick(rx, ry)) {
        starting = true;
        canvas.removeEventListener("mousedown", intichose, false);
        moveearth();
    } else if (bssound.isroundclick(rx, ry)) {
        if (soundflag) {
            bssound.img = imgnosound;
            soundflag = false;
        } else {
            bssound.img = imgsound;
            soundflag = true;
        }
    }
}
var intilbstartr = bstartr;
var iniilbstarl = 760;
function moveearth() {
    startearth.r = bstartr;
    bstartr--;
    startearth.length = iniilbstarl * (bstartr / intilbstartr);
    if (bstartr >= earthr) {
        setTimeout(moveearth, 10);
    } else {
        isstart = true;
        
        mearth.nowx = startearth.nowx;
        setTimeout(start,30);
    }
}
function welcome() {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bg, 0, 0);
    drawearth(bstartr, startearth);
    if (!isstart) {
        if (!starting) {
            bssound.draw();
            //ctx.drawImage(imghead, midx - 218, 3, 437,100);
            ctx.save();
            ctx.translate(midx, midy);
            ctx.rotate(Math.PI / 180 * startangle);
            ctx.drawImage(img2012, bstartr-140, bstartr-140);
            ctx.restore();
            startangle+=0.2;
            startangle % 360;
        }
        if (!startpause)
            setTimeout(welcome, 15);
        else {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(imgsnap, 0, 0);
        }
    }
}
function drawearth(r, cearth) {
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00FFFF";
    ctx.beginPath();
    ctx.arc(midx, midy, r , 0, Math.PI / 180 * 2, true);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    // ctx.arc(midx, midy, distance *g2+g2*moonr/2, Math.PI / 180 * (monnangle+45), Math.PI / 180 * (monnangle-45), true);
    ctx.arc(midx, midy, r, 0, Math.PI / 180 * 2, true);
    ctx.clip();
    //ctx.drawImage(imgearth, midx - earthr, midy - earthr);
    cearth.drawsmall();
    ctx.restore();
    ctx.save();
    var my_gradient = ctx.createRadialGradient(midx, midy, 1, midx, midy, r);
    my_gradient.addColorStop(0, "#FFFFFF"); //定义渐变色
    my_gradient.addColorStop(1, "#000000");

    ctx.fillStyle = my_gradient;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    // ctx.arc(midx, midy, distance *g2+g2*moonr/2, Math.PI / 180 * (monnangle+45), Math.PI / 180 * (monnangle-45), true);
    ctx.arc(midx, midy, r, 0, Math.PI / 180 * 2, true);
    ctx.fill();
    ctx.restore();
}
function start() {
    drawid = setInterval(draw, 20); 
    Metcome();
    canvas.addEventListener("mousedown", clickdown, false);
    canvas.addEventListener("mouseup", clickup, false);
}

function RoundButton(x, y, r, img) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.r=r;
    this.isclick = function (cx, cy) {
        if ((cx - this.x) * (cx - this.x) + (cy - this.y) * (cy - this.y) <= this.r * this.r)
            return true;
        return false;
    }
}
function ImageButton(x, y, w,h,img) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.isclick = function (cx, cy) {
        if ((cx - this.x <= this.w) && (cy - this.y <= this.h))
            return true;
        return false;
    }
    this.draw = function () {
        ctx.drawImage(this.img, this.x, this.y,this.w,this.h);
    }
    this.isroundclick = function (cx, cy) {
        if ((cx - this.x - w / 2) * (cx - this.x - w / 2) + (cy - this.y - h / 2) * (cy - this.y - h / 2) <= w*h/4)
            return true;
        return false;
    }
}
function Earth(length, r, img) {
    this.img = img;
    this.r = r;
    this.nowx = midx - this.r;
    this.nowy = midy - this.r;
    this.length = length;
    this.draw = function () {
        if (this.nowx < midx - this.r - this.length) {
            this.nowx = midx - this.r;
        }
        ctx.drawImage(this.img, this.nowx, this.nowy);
        if (this.nowx < (midx - (this.length - this.r))) {
            ctx.drawImage(this.img, this.nowx + length-0.2, this.nowy);
        }
        this.nowx-=0.5;
    }
    this.drawsmall = function () {
        if (this.nowx < midx - this.r - this.length) {
            this.nowx = midx - this.r;
        }
        this.nowy = midy - this.r;
        ctx.drawImage(this.img, this.nowx, this.nowy, this.length, this.r*2);
        if (this.nowx < (midx - (this.length - this.r))) {
            ctx.drawImage(this.img, this.nowx + this.length - 0.2, this.nowy, this.length, this.r*2);
        }
        this.nowx -=0.5;
    }
}

function Meteorite(iangle, ir) {
    this.isboom = false;
    this.angle = iangle;
    this.r=ir;
    this.distance = longest;
    this.next;
    this.pre;
    this.det=2;
    this.resetdistance = function () {
        var arf = this.angle + 45;
        arf =arf% 360;
        if (arf >= 45 && arf <= 90) {
            this.distance = height / Math.sin(Math.PI / 180 * arf)/2;
        }
        else if (arf > 90 && arf <= 135) {
            this.distance = height / Math.cos(Math.PI / 180 * (arf - 90)) / 2;
        }
        else if (arf > 135 && arf <= 180) {
            this.distance = width / Math.sin(Math.PI / 180 * (arf - 90)) / 2;
        }
        else if (arf > 180 && arf <= 225) {
            this.distance = width / Math.cos(Math.PI / 180 * (arf - 180)) / 2;
        }
        else if (arf > 225 && arf <= 270) {
            this.distance = height / Math.sin(Math.PI / 180 * (arf - 180)) / 2;
        }
        else if (arf > 270 && arf <= 315) {
            this.distance = height / Math.cos(Math.PI / 180 * (arf - 270)) / 2;
        }
        else if (arf > 315 && arf < 360) {
            this.distance = width / Math.sin(Math.PI / 180 * (arf - 270)) / 2;
        }
        else if (arf >=0 && arf < 45) {
            this.distance = width / Math.cos(Math.PI / 180 * arf) / 2;
        }
        this.distance = this.distance/g2;
    }
}

function MetList() {
    this.sum = 0;
    this.array = new Array();
    this.free = new Array();
    this.last = 0;
    this.count = 0;
    this.add = function (angle, r) {
        for(var i=0;i<this.sum;i++){
            if (this.free[i]) {
                this.array[i].angle = angle;
                this.array[i].r = r;
                this.array[i].resetdistance();
                this.last = i;
                return;
            }
        }
        
        this.array[this.sum] = new Meteorite(angle, r);
        this.array[this.sum].resetdistance();
        this.free[this.sum] = false;
        this.last = this.sum;
        this.sum++;
        this.count++;
        
    }

    this.myremove = function (index) {
        this.free[index] = true;
        if (index == (this.sum - 1)) {
            var i = index;
            while (i >= 0 && this.free[i]) {
                this.sum--;
                i--;
            }
        }
        this.count--;
    }
    this.setboom=function(index){
        this.array[index].isboom=true;
    }
    this.isboom = function (index) {
        return this.array[index].isboom;
    }
    this.isfree = function(index){
            return this.free[index];
    }
    this.getangle = function (index) {
        return this.array[index].angle;
    }
    this.getdistance = function (index) {
        return this.array[index].distance;
    }
    this.getr = function (index) {
        return this.array[index].r;
    }
    this.reddistance = function (index) {
        this.array[index].distance -= this.array[index].det;
    }
    this.setlastdet = function (nowdet) {
        this.array[this.last].det = nowdet;
    }
}

function RoadQueue() {
    this.pointr = new Array();
    this.pointarc = new Array();
    this.sum = 0;
    this.length=20;
    this.full=false;
    this.add = function (r, arc) {
        /*var lastindex;
        if (this.sum == 0) {
            if (this.full)
                lastindex = this.length - 1;
            else {
                this.pointr[this.sum] = r;
                this.pointarc[this.sum] = arc;
                this.sum++;
                return;
            }
        } else {
            lastindex = this.sum - 1;
        }
        var detr = r-this.pointr[lastindex] ;
        var detarc = 2.5;
        for (var i = 0; i < 2; i++) {
            this.pointr[this.sum] = this.pointr[lastindex] + detr;
            this.pointarc[this.sum] = (this.pointarc[lastindex] + detarc)%360;
            lastindex = this.sum;
            this.sum++;
            if (this.sum >= this.length) {
                this.sum = this.sum % this.length;
                this.full = true;
            }
            
        }*/
        this.pointr[this.sum] = r;
        this.pointarc[this.sum] = arc;
        this.sum++;
        if (this.sum >= this.length) {
            this.sum = this.sum % this.length;
            this.full = true;
        }
    }
    this.draw = function () {

        var nowr = 8;
        var detr = (moonr - nowr) / this.length;
        //ctx.fillStyle = "#FFFFFF";
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#F0F0F0";
        /*var my_gradient = ctx.createRadialGradient(midx, midy, 10, midx, midy, moonr);
        my_gradient.addColorStop(0, "#FFFFFF"); //定义红色渐变色
        my_gradient.addColorStop(1, "#FFFFFF");*/
        ctx.fillStyle = "#F0F0F0";
        ctx.globalAlpha = 0.2;
        if (this.full) {
            for (var i = this.sum; i < this.length; i++) {
                ctx.save();
                ctx.translate(midx, midy);
                ctx.rotate(Math.PI / 180 * this.pointarc[i]);
                ctx.beginPath();
                ctx.arc(this.pointr[i], this.pointr[i], nowr, 0, Math.PI / 180 * 2, true);
                ctx.fill();
                ctx.restore();
                nowr += detr;
            }
        }
        for (var i = 0; i < this.sum; i++) {
            ctx.save();
            ctx.translate(midx, midy);
            ctx.rotate(Math.PI / 180 * this.pointarc[i]);
            ctx.beginPath();
            ctx.arc(this.pointr[i], this.pointr[i], nowr, 0, Math.PI / 180 * 2, true);
            ctx.fill();
            ctx.restore();
            nowr += detr;
        }
        ctx.restore();
    }
}
var lastdis=distance+moonr

function draw() {
    canvas.width = 0;
    canvas.height = 0;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(bg, 0, 0);
    if (!end) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00FFFF";
        ctx.beginPath();
        // ctx.arc(midx, midy, distance *g2+g2*moonr/2, Math.PI / 180 * (monnangle+45), Math.PI / 180 * (monnangle-45), true);
        ctx.arc(midx, midy, earthr + 1, 0, Math.PI / 180 * 2, true);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        // ctx.arc(midx, midy, distance *g2+g2*moonr/2, Math.PI / 180 * (monnangle+45), Math.PI / 180 * (monnangle-45), true);
        ctx.arc(midx, midy, earthr, 0, Math.PI / 180 * 2, true);
        ctx.clip();
        //ctx.drawImage(imgearth, midx - earthr, midy - earthr);
        mearth.draw();
        ctx.restore();

        ctx.save();
        var my_gradient = ctx.createRadialGradient(midx, midy, 1, midx, midy, earthr);
        my_gradient.addColorStop(0, "#FFFFFF"); //定义红色渐变色
        my_gradient.addColorStop(1, "#000000");

        ctx.fillStyle = my_gradient;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        // ctx.arc(midx, midy, distance *g2+g2*moonr/2, Math.PI / 180 * (monnangle+45), Math.PI / 180 * (monnangle-45), true);
        ctx.arc(midx, midy, earthr, 0, Math.PI / 180 * 2, true);
        ctx.fill();
        ctx.restore();
    }

    roadqueue.draw();
    ctx.save();
    ctx.translate(midx, midy);
    ctx.rotate(Math.PI / 180 * monnangle);
    ctx.drawImage(imgmoon, distance, distance);
    ctx.restore();
    
    
    var mdistance, mr, mangle;
    for (var i = 0; i < mlist.sum; i++) {
        if (!mlist.isfree(i)) {
            
            mdistance = mlist.getdistance(i);
            mr = mlist.getr(i);
            mangle = mlist.getangle(i);
            if (mlist.isboom(i)) {
                ctx.save();
                ctx.translate(midx, midy);
                ctx.rotate(Math.PI / 180 * mangle);
                ctx.drawImage(imghiterboom, mdistance, mdistance);
                ctx.restore();
            }else if (isboom(distance, moonr, monnangle, mdistance, mr, mangle)) {
                mlist.setboom(i);
                setTimeout("mlist.myremove("+i+")",1000);
                grade++;
                playsound("sounds/hit.wav");
            }else if (ishit(mdistance+30, mr)) {
                //mlist.myremove(i);
                ctx.save();
                ctx.translate(midx, midy);
                ctx.rotate(Math.PI / 180 * mangle);
                ctx.drawImage(imghiterboom, mdistance, mdistance);
                ctx.restore();
                if(!end){
                    end = true;
                    draw();
                    playsound("sounds/hit.wav");
                    myend();
                    ep.draw();
                    
                    if(Score!=null){
                        if ((grade * 100 + parseInt(nowtime * 11)) > parseInt(Score)) {
                            window.localStorage.setItem("High", (grade * 100 + parseInt(nowtime * 11)));
                        }
                    }else
                        window.localStorage.setItem("High", (grade * 100 + parseInt(nowtime * 11)));
                }
            } else {
                ctx.save();
                ctx.translate(midx, midy);
                ctx.rotate(Math.PI / 180 * mangle);
                ctx.drawImage(imghiter, mdistance, mdistance);
                mlist.reddistance(i);
                ctx.restore();
            }
        }
    }
    if (!end) {
        monnangle += 2;
        monnangle = monnangle % 360;
        roadqueue.add(distance + moonr + (distance + moonr - lastdis) / 2, monnangle);
        monnangle += 2;
        monnangle = monnangle % 360;
        roadqueue.add(distance + moonr, monnangle);
        lastdis = distance + moonr;
        nowtime += 0.02;
    }
    if (pause) {
        //clearid(drawid);
        clearid(drawid);
        drawid = -1;
        return;
    } else {
        if (!end) {
            bpause.draw();
        }
    }
    d.innerHTML = "Score：" + (grade * 100 +parseInt(nowtime*11))+"________Best："+Score;
    

}
function playsound(src) {
    if (soundflag) {
        //soundplayer.src = src;
        soundplayer.play();
    }
}
function ishit(d, r) {
    if ((d + r * g2 / 2) < earthr) {
        return true;
    } else {
        return false;
    }
}
function isboom(d1, r1, arf1, d2, r2, arf2) {
    var arf = Math.abs(arf1 - arf2);
    var a = g2 * d1 + g2 * r1 / 2;
    var b = g2 * d2 + g2 * r2 / 2;
    if (arf > 180) {
        arf = 360 - arf;
    }
    return checkboom(a, b, arf, r1, r2);
}
function checkboom(a, b, arf, ar, br) {
    var co;
    var qiu = (a * a + b * b - 2 * a * b * Math.cos(Math.PI / 180 * arf));
    var shi = ((ar + br) * (ar + br));
    if (qiu < shi) {
        return true;
    }
    return false;
}

function Metcome() {
    mlist.add(Math.random() * 360, hiterr);
    mlist.setlastdet(Math.random() * 1 + 1);
    if(!pause)
        metcomeid=setTimeout(Metcome, 2000 - nowtime / 100);
    //div.innerHTML = mlist.count;
}

function clickup() {
    if (clicked) {
        clicked = false;
        if (paddid != -1) {
            clearid(paddid);
            paddid = -1;
        }
        predid = setInterval(reddistance, 10);
    }
}
function clickdown(e) {
    var rx;
    var ry;
    if (e.pageX || e.pageY) {
        rx = e.pageX;
        ry = e.pageY;
    }
    else {
        rx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        ry = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    rx -= canvas.offsetLeft;
    ry -= canvas.offsetTop;
    if (bpause.isroundclick(rx, ry)) {
        mypause();
    }
    else if (!clicked) {
        clicked = true;
        if (predid != -1) {
            clearid(predid);
            predid = -1;
        }
        paddid = setInterval(adddistance, 10);
    }
}
function adddistance() {
    if (!pause && clicked && distance < maxdistance) {
        distance += 2.1;
    } else {
        if (paddid != -1) {
            setTimeout(clearid(paddid), 1);
            paddid = -1;
        }
    }
}
function reddistance() {
    if (!pause&&!clicked && distance > mindistance) {
        distance -= 2.3;
    } else {
        if (predid != -1) {
            setTimeout(clearid(predid), 1);
            predid = -1;
        }
    }
}
function clearid(id) {
    if(id!=-1)
        clearInterval(id);
}

function mypause() {
    pause = true;
    clearallp();
    canvas.removeEventListener("mousedown", clickdown, false);
    canvas.removeEventListener("mouseup", clickup, false);
    canvas.addEventListener("mousedown", pauseclick, false);
    pp.draw();
}

function mycontinue() {
    if (isstart) {
        pause = false;
        start();
        if (clicked) {
            paddid = setInterval(adddistance, 10);
        } else {
            predid = setInterval(reddistance, 10);
        }
    }
}

function pauseclick(e) {
    var rx;
    var ry;
    if (e.pageX || e.pageY) {
        rx = e.pageX;
        ry = e.pageY;
    }
    else {
        rx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        ry = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    rx -= canvas.offsetLeft;
    ry -= canvas.offsetTop;
    if (pp.doclick(rx, ry)) {
        canvas.removeEventListener("mousedown", pauseclick, false);
    }
}

function restart() {
    initilvars();
    start();
}

function clearallp() {
    clearid(metcomeid);
    clearid(drawid);
    clearid(predid);
    clearid(paddid);
    drawid = -1;
    predid = -1;
    daddid = -1;
    metcomeid = -1;
}

function pausepanel() {
    this.bcontinue = new ImageButton(midx + 70, midy - 30 + 200, 60, 60, imgcontinue);
    this.brepaly = new ImageButton(midx - 30, midy - 30 + 200, 60, 60, imgrepaly);
    this.bhome = new ImageButton(midx - 130, midy - 30+200, 60, 60, imghome);
    this.bbg = new ImageButton(midx - 150, midy - 35+200, 300, 70, imgpausebg);
    this.doclick=function (cx,cy){
        if (this.bcontinue.isroundclick(cx, cy)) {
            mycontinue();
            return true;
        } else if (this.brepaly.isroundclick(cx, cy)) {
            restart();
            return true;
        } else if (this.bhome.isroundclick(cx, cy)) {
            home();
            return true;
        }
        return false;
    }
    this.draw=function (){
        this.bbg.draw();
        this.bhome.draw();
        this.bcontinue.draw();
        this.brepaly.draw();
    }
}
var ep = new endpanel();
function endpanel() {
    this.brepaly = new ImageButton(midx - 105, midy - 30 + 200, 60, 60, imgrepaly);
    this.bhome = new ImageButton(midx +40, midy - 30 + 200, 60, 60, imghome);
    this.bbg = new ImageButton(midx - 150, midy - 35 + 200, 300, 70, imgpausebg);
    this.doclick = function (cx, cy) {
        if (this.brepaly.isroundclick(cx, cy)) {
            restart();
            return true;
        } else if (this.bhome.isroundclick(cx, cy)) {
            home();
            return true;
        }
        return false;
    }
    this.draw = function () {
        this.bbg.draw();
        this.bhome.draw();
        this.brepaly.draw();
    }
}

function home() {
    isstart = false;
    initilvars();
    initial();
}

function myend() {
    pause = true;
    clearallp();
    canvas.removeEventListener("mousedown", clickdown, false);
    canvas.removeEventListener("mouseup", clickup, false);
    canvas.addEventListener("mousedown", endclick, false);
    bend.draw();
}

function endclick(e) {
    var rx;
    var ry;
    if (e.pageX || e.pageY) {
        rx = e.pageX;
        ry = e.pageY;
    }
    else {
        rx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        ry = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    rx -= canvas.offsetLeft;
    ry -= canvas.offsetTop;
    if (bend.isclick(rx, ry)) {
        canvas.removeEventListener("mousedown", endclick, false);
        restart();
    } else if (ep.doclick(rx, ry)) {
        canvas.removeEventListener("mousedown", endclick, false);
    }
}