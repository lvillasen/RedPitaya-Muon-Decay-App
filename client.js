console.log("welcome to client_new");

var ip="";
var Nth_edge =1;
var trig_mode = "SINGLE";
var edge = 0;
var rp_url="";
var n_event=0;
var n_event_tag = 0;
var single_evt = 0;
var x_at_trigger= 0;
var trig_delay = -1;
var event_to_visualize = 1;
var previous_events = [];
var myArray = [];

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");
const hour = String(currentDate.getHours()).padStart(2, "0");
const minute = String(currentDate.getMinutes()).padStart(2, "0");
const filename = `MD${year}${month}${day}_${hour}${minute}.csv`;
const file = String(filename);
document.getElementById("visualize").value = filename;
console.log(filename);

var file_to_view =""



function connect() {
    ip = document.getElementById("ip").value;
    rp_url = "http://"+ip;
    console.log("My URL is "+rp_url)
    const Http = new XMLHttpRequest();
    var url = rp_url+':3000/connect';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
        document.getElementById("connect_display").innerHTML = Http.responseText;
    }
}




function stop_DAC() {


    const url = rp_url+':3001/stop_DAC';
    console.log('STOP DAC sent to server');
        const Http = new XMLHttpRequest();
        Http.open("GET", url);
        Http.send();
}



function arm_trigger() {
 
        console.log('ARM TRIGGER sent to server');
    
        n_event+=1;
        n_event_tag = 10*n_event;
        const url1 = rp_url+':3001/arm_trig/'+ n_event + "/" + trig_mode + "/" + file

        console.log(url1)
        const Http = new XMLHttpRequest();

        Http.open("GET", url1 );
        Http.send();
        Http.onreadystatechange = (e) => {
            var resp = Http.responseText;

            console.log("ARM TRIGGER Server response for event: " + n_event)
            myArray = resp.split(",");
            if (myArray.length > 10) {

            document.getElementById("data_display_plot").innerHTML = myArray[0];


            X_data = [];
            Y_data =[]
            for (var i = 2; i < myArray.length-2; i++) {
                X_data.push((i-2)*8);
                Y_data.push(parseFloat(myArray[i]));
            }
            console.log("Number of data points =", myArray.length-2)
            if (myArray.length>10){
                draw();
      }  else {
        document.getElementById("arm_trigger").value ="OFF"
    }

      }
      }     
  }
    


function draw() {
    if (document.getElementById("arm_trigger").value == "SINGLE") {
        document.getElementById("arm_trigger").value ="OFF"
    }
    
    var layout = {
        xaxis: {
            title: "Time (ns)"
        },
        yaxis: {
            title: "Amplitude (mV)"
        },
        shapes: [{
    type: 'line',
    x0: (x_at_trigger-trig_delay)*8,
    y0: 0,
    x1: (x_at_trigger-trig_delay)*8,
    yref: 'paper',
    y1: 1,
    line: {
      color: 'green',
      width: 2,
      dash: 'dot'
    }
  }],
    title: {
            text:"Data Acquired <br> Event: " + n_event,
          font: {
      family: 'Times New Roman',
      size: 24
    },
}
    };
    var data = [{
        x: X_data,
        y: Y_data,
        mode: "lines+markers",
        type: 'line',
        marker: {
            color: 'blue',
            size: 4,
            line: {
                color: 'black',
                width: .2
            }
        },
    }];

    Plotly.newPlot("plot1", data, layout);

}



function upload() {
    const code = document.getElementById("code_input_upload").value;
    const Http = new XMLHttpRequest();
    const url = rp_url+':3000/upload?text='+encodeURIComponent(code);
    console.log('UPLOAD WAVE sent to server');

    fetch(url)
        .then(response => {
            response => response.text();
            response => response();
        })
        .then(data => console.log(data))
        .catch(error => {
            console.error('Error with Upload waveform:', error);
        });
}


function start_DAC() {
    const code = document.getElementById("code_input_start_DAC").value;
    document.getElementById("generator").value = "ON";
    //const Http = new XMLHttpRequest();
    const url = rp_url+':3000/start_DAC?text='+encodeURIComponent(code);
    console.log('START DAC sent to server');

    fetch(url)
        .then(response => {
            response => response.text();
            response => response();
        })
        .catch(error => {
            console.error('Error with Start DAC:', error);
        });
}



function save_arm_trigger() {
    const code = document.getElementById("code_input_save").value;
    const url = rp_url+':3000/save?text='+encodeURIComponent(code);
    console.log('SAVE sent to server');

    fetch(url)
        .then(response => {
            response => response.text();
            response => response();
        })
        .catch(error => {
            console.error('Error with Save:', error);
        });
}

function visualize() {
    if (!document.getElementById('localFile').checked) {

    
        file_to_view = document.getElementById("visualize").value;   
        console.log(file_to_view)
        console.log('VISUALIZE sent to server');

        const url1 = rp_url+':3000/visualize/'+  file_to_view

        console.log(url1)
        const Http = new XMLHttpRequest();

        Http.open("GET", url1 );
        Http.send();
        Http.onreadystatechange = (e) => {
            var resp = Http.responseText;
            previous_events= resp.split("\n");
            console.log("VISUALIZE Server response")
            console.log(previous_events.length)
            event_to_visualize = -1;
            next()
            
}
}
}


function single() {
    if (document.getElementById("arm_trigger").value != "SINGLE") {
        document.getElementById("arm_trigger").value = "SINGLE";

        console.log("Trigger is SINGLE ON ....");
        trig_mode = "SINGLE"
        arm_trigger();
        
        
    }

}

function normal() {
    if (document.getElementById("arm_trigger").value != "NORMAL") {
        document.getElementById("arm_trigger").value = "NORMAL";

        console.log("Trigger is NORMAL ON ....");
        trig_mode = "NORMAL"
        arm_trigger();
        
        
    }

}

function trigger() {
        document.getElementById("arm_trigger").value = "OFF";
        document.getElementById("generator").value = "OFF";
        
        console.log("Generation and Acquisition are OFF ....");
        stop_DAC();
}

function next(){
     if (event_to_visualize < previous_events.length-2 ) {
        event_to_visualize++;

myArray = previous_events[event_to_visualize].split(",");
        document.getElementById("data_display_plot2").innerHTML = myArray[0];

    n_event = parseInt(myArray[1]);
            X_data = [];
            Y_data =[]
            for (var i = 2; i < myArray.length-2; i++) {
                X_data.push((i-2)*8);
                Y_data.push(parseFloat(myArray[i]));
            }
            console.log("Number of data points =", myArray.length-2)

                draw_previous();

}
}
function previous(){
    if (event_to_visualize > 0) {
        event_to_visualize--;
    

myArray = previous_events[event_to_visualize].split(",");
        document.getElementById("data_display_plot2").innerHTML = myArray[0];

    n_event = parseInt(myArray[1]);
            X_data = [];
            Y_data =[]
            for (var i = 2; i < myArray.length-2; i++) {
                X_data.push((i-2)*8);
                Y_data.push(parseFloat(myArray[i]));
            }
            console.log("Number of data points =", myArray.length-2)

                draw_previous();
            }

}


function loadFile() {
    if (document.getElementById('localFile').checked) {

  const content = document.querySelector(".content");
  const [file] = document.querySelector("input[type=file]").files;
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      
      let myData = String(reader.result);
      previous_events= myData.split("\n");
      event_to_visualize = -1;
        next()
    },
    false,
  );

  if (file) {
    reader.readAsText(file);
  }
}
}

function draw_previous() {
    if (document.getElementById("arm_trigger").value == "SINGLE") {
        document.getElementById("arm_trigger").value ="OFF"
    }
    
    var layout = {
        xaxis: {
            title: "Time (ns)"
        },
        yaxis: {
            title: "Amplitude (mV)"
        },
        shapes: [{
    type: 'line',
    x0: (x_at_trigger-trig_delay)*8,
    y0: 0,
    x1: (x_at_trigger-trig_delay)*8,
    yref: 'paper',
    y1: 1,
    line: {
      color: 'green',
      width: 2,
      dash: 'dot'
    }
  }],
    title: {
            text:"Data Acquired <br> Event: " + n_event,
          font: {
      family: 'Times New Roman',
      size: 24
    },
}
    };
    var data = [{
        x: X_data,
        y: Y_data,
        mode: "lines+markers",
        type: 'line',
        marker: {
            color: 'blue',
            size: 4,
            line: {
                color: 'black',
                width: .2
            }
        },
    }];

    Plotly.newPlot("plot2", data, layout);

}
