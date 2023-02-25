// -----wheel-spin-js------
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get("email");
const name1 = urlParams.get("name");
var padding = { top: 0, right: 0, bottom: 0, left: 0 },
  w = 400 - padding.left - padding.right,
  h = 400 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  oldpick = [],
  color = d3.scale.category20(); //category20c()
//randomNumbers = getRandomNumbers();

var data = [
  { label: "10", value: 1, xp: "10 points" },
  { label: "30", value: 1, xp: "30 points" },
  { label: "40", value: 1, xp: "40 points" },
  { label: "60", value: 1, xp: "60 points" },
  { label: "80", value: 1, xp: "80 points" },
  { label: "100", value: 1, xp: "100 points" },
];
var svg = d3
  .select("#spinwheel")
  .append("svg")
  .data([data])
  .attr("xmlns", "http://www.w3.org/2000/svg")
  .attr("viewBox", "0 0 " + w + " " + w + "")
  .attr("width", w)
  .attr("height", h + padding.top + padding.bottom);
var container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
  );
var vis = container.append("g");

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return 1;
  });
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis
  .selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class", "slice");

arcs
  .append("path")
  .attr("fill", function (d, i) {
    return color(i);
  })
  .attr("d", function (d) {
    return arc(d);
  });
// add the text
arcs
  .append("text")
  .attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return (
      "rotate(" +
      ((d.angle * 180) / Math.PI - 90) +
      ")translate(" +
      (d.outerRadius - 60) +
      ")"
    );
  })
  .attr("font-size", "20")
  .attr("fill", "#ffffff")
  .attr("text-anchor", "end")
  .text(function (d, i) {
    return data[i].label;
  });
$("#spin").on("click", spin);
function spin(d) {
  $("#spin").on("click", null);
  //all slices have been seen, all done
  //console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
  if (oldpick.length == data.length) {
    console.log("done");
    $("#spin").on("click", null);
    return;
  }
  var ps = 360 / data.length,
    pieslice = Math.round(1440 / data.length),
    rng = Math.floor(Math.random() * 1440 + 360);

  rotation = Math.round(rng / ps) * ps;
  //console.log(rotation);

  picked = Math.round(data.length - (rotation % 360) / ps) + 2;

  picked = picked >= data.length ? picked % data.length : picked;
  if (oldpick.indexOf(picked) !== -1) {
    d3.select(this).call(spin);
    return;
  } else {
    oldpick.push(picked);
  }
  rotation += 90 - Math.round(ps / 1);
  var interval = setInterval(function () {
    $(".wheeldots").addClass("active-dots");
    setTimeout(function () {
      $(".wheeldots").removeClass("active-dots");
    }, 100);
  });
  vis
    .transition()
    .duration(3000)
    .attrTween("transform", rotTween)
    .each("end", function () {
      clearInterval(interval);
      //mark question as seen
      d3.select(".slice:nth-child(" + (picked + 1) + ") path");
      //populate question
      d3.select("#question h1").text(data[picked].question);
      oldrotation = rotation;
      alert(data[picked].xp);
      valueofwinner = data[picked].xp;
      post(valueofwinner, email, name1);

      //container.on("click", spin);
    });
}
//make arrow
// svg.append("g")
//     .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
//     .append("path")
//     .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
//     .style({"fill":"black"});
//draw spin circle
container
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 30)
  .style({ fill: "#ffffff" });
//spin text
// container.append("text")
//     .attr("x", 0)
//     .attr("y", 15)
//     .attr("text-anchor", "middle")
//     .text("SPIN")
//     .style({"font-weight":"bold", "font-size":"30px"});

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}

function getRandomNumbers() {
  var array = new Uint16Array(1000);
  var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
  if (
    window.hasOwnProperty("crypto") &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    window.crypto.getRandomValues(array);
    console.log("works");
  } else {
    //no support for crypto, get crappy random numbers
    for (var i = 0; i < 1000; i++) {
      array[i] = Math.floor(Math.random() * 100000) + 1;
    }
  }
  return array;
}

function post(valueofwinner, email, name1) {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic ZlZQWHVmS3c2cm5UTWFoSHF6Zjp4");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Cookie",
      "_itildesk_session=aUhLclNSUzRpZHAyWlZRUjJRQURMdW4vNkpYcTYxVWgzL25kcno4Wkh2c2ZlbTdackJhTVNLdlZhZTRBdk5SMDd1RU9BTW9KdnBUblBrdXJad29TbDVJSkdZM3FoeGRlK2VxM2F1alhidE8rS3dMUCtRd3hBVmQ3ejdiNGFvSmwyZEsvcCtBUWhlcEpMblA4bnJMWjkrR0hscDMrZDFCc3JaUE45MDNQOXZSZlNNM0RKWnFHUHdmR2luM2llV1V3LS1MNHhOclp3d2Y2TzNMaE5qZmVUY2Z3PT0%3D--fc0d47ebae345163ab224c6826851f1abd18b4dc; _x_m=x_c; _x_w=4000; current_workspace_id=2"
    );

   

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
     
      redirect: "follow",
    };

    fetch(
      "https://riteshyadav.freshservice.com/api/v2/objects/27000042933/records",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        resp = JSON.parse(result);
        console.log(resp.records)
      })
      .catch((error) => console.log("error", error));
//   var myHeaders = new Headers();
//   myHeaders.append("Authorization", "Basic ZlZQWHVmS3c2cm5UTWFoSHF6Zjp4");
//   myHeaders.append("Content-Type", "application/json");
//   myHeaders.append(
//     "Cookie",
//     "_itildesk_session=OTdEa2pIQ3R6WDJQN2loZE55bE5jemVrMk9KTk14TXliY2w0bWlCQ0ppRVl5ZUdyUjBNN21SS21mZVFLb3VsSkNGRHVMUHBrVWpjUEpBUzdxSEM5U3BNWE1uRFZnbXRwUGxZdlloc0U5Q3EyUldBQUpyR1BmQ3dscThva2tvVUZYOVk0dFpRdmIzMk02R05rS25SU0FNQ0tMQnpyME81dXN4dndyWWpGVEc5UjdONzZFK0xjNkhiS0ZKV1Exei9wLS1TcUJDbVFWUnpycXdOcTlvOHRUT1VRPT0%3D--5661b3b1ed52da4de6ec748043afb73d0e72c4c5; _x_m=x_c; _x_w=4000; current_workspace_id=2"
//   );

//   var raw = JSON.stringify({
//     data: {
//       email: email,
//       name: name1,
//       rewards_point: valueofwinner,
//     },
//   });

//   var requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//     redirect: "follow",
//   };

//   fetch(
//     "https://riteshyadav.freshservice.com/api/v2/objects/27000042933/records",
//     requestOptions
//   )
//     .then((response) => response.text())
//     .then((result) => console.log(result))
//     .catch((error) => console.log("error", error));
}
