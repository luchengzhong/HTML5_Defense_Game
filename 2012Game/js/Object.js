
var height = 768;
var width = 1366;
var midx = 0;
var midy = height / 2;
var distance = 80;
var monnangle = 0;

var canvas = document.getElementById('myCanvas');
var div = document.getElementById('d');
var ctx = canvas.getContext('2d');

var imgmoon = new Image();
imgmoon.src = "/images/moon.jpg";

var bg = new Image();
var imgDat;
bg.onload = function () {
    ctx.drawImage(bg, 0, 0);
    //imgDat = ctx.getImageData(0, 0, canvas.width, canvas.height);

}
bg.src = "/images/testbg.jpg";

setInterval(draw, 20);
function draw() {
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(midx - 3, 20, distance, distance);
    //ctx.putImageData(imgDat, 0, 0, 0, 0, 0, 0);
    ctx.drawImage(bg, 0, 0);

    ctx.save();
    ctx.translate(midx+=3, 0);
    //ctx.rotate(Math.PI / 180 * monnangle);
    ctx.drawImage(imgmoon, distance, distance);
    //ctx.fillRect(0, 20, 40, 40);
    ctx.restore();
    if (midx > 1366)
        midx = 0;
    //ctx.restore();
    //monnangle++;
    //monnangle = monnangle % 360;
    //midx = midx % 800;
}