'use strict';
function Stopwatch(options) {
  var elem = options.elem;
  //html elements
  var startStopBtn;
  var resetLapBtn;
  var hoursLabel;
  var minutesLabel;
  var secondsLabel;
  var millisecondsLabel;
  var listDiv;
  //timerId;
  var timer;
  //calculate time if timer was stopped
  var startTime;
  //for calculating if timer was stopped
  var previousTime = 0;
  //status of stopwatch;
  var running = false;

  //render user interface
  function render() {
    var stopwatch = document.createElement("div");
    stopwatch.classList.add("stopwatch");
    stopwatch.appendChild(renderHeader());
    stopwatch.appendChild(renderList());
    elem.appendChild(stopwatch);
  }
  function renderHeader() {
    var stopwatchHeader = document.createElement("div");
    stopwatchHeader.classList.add("stopwatch-header");

    var watchText = document.createElement("div");
    watchText.classList.add("stopwatch-header__watch-text");
    hoursLabel = document.createElement("span");
    hoursLabel.classList.add("stopwatch-header__hours");
    minutesLabel = document.createElement("span");
    minutesLabel.classList.add("stopwatch-header__minutes");
    secondsLabel = document.createElement("span");
    secondsLabel.classList.add("stopwatch-header__seconds");
    millisecondsLabel = document.createElement("span");
    millisecondsLabel.classList.add("stopwatch-header__milliseconds");
    startPosition();
    watchText.appendChild(hoursLabel);
    watchText.appendChild(document.createTextNode(":"));
    watchText.appendChild(minutesLabel);
    watchText.appendChild(document.createTextNode(":"));
    watchText.appendChild(secondsLabel);
    watchText.appendChild(document.createTextNode(":"));
    watchText.appendChild(millisecondsLabel);

    var controls = document.createElement("div");
    controls.classList.add("stopwatch-header__controls");
    startStopBtn = document.createElement("div");
    startStopBtn.classList.add("stopwatch-header__btn");
    startStopBtn.classList.add("stopwatch-header__btn_green");
    startStopBtn.classList.add("stopwatch-header__btn_start-stop");
    startStopBtn.innerHTML = "start";
    resetLapBtn = document.createElement("div");
    resetLapBtn.classList.add("stopwatch-header__btn");
    resetLapBtn.classList.add("stopwatch-header__btn_red");
    resetLapBtn.classList.add("stopwatch-header__btn_reset-lap");
    resetLapBtn.innerHTML = "reset";
    controls.appendChild(startStopBtn);
    controls.appendChild(resetLapBtn);

    stopwatchHeader.appendChild(watchText);
    stopwatchHeader.appendChild(controls);
    return stopwatchHeader;
  }
  function renderList() {
    listDiv = document.createElement("div");
    listDiv.classList.add("stopwatch-list");
    return listDiv;
  }
  render();
  //for calculating difference between start new Date() and new Date() now
  function calculateTime(timestamp) {
    var milliseconds = timestamp;
    var seconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);

    milliseconds %= 1000;
    seconds %= 60;
    minutes %= 60;

    return {hours : hours < 10 ? "0" + hours : hours,
            minutes : minutes < 10 ? "0" + minutes : minutes,
            seconds : seconds < 10 ? "0" + seconds : seconds,
            milliseconds : milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds};
  }

  //public method for getting time;
  function getTime() {
    var time = calculateTime((new Date).getTime() - startTime);
    return {hours : time.hours,
            minutes : time.minutes,
            seconds : time.seconds,
            milliseconds : time.milliseconds};
  }
  this.getTime = getTime;

  //invokes after click on start btn
  function start() {
      if(!startTime)
        startTime = (new Date()).getTime() - previousTime;
      timer = setInterval(function() {
      var time = getTime();
      hoursLabel.innerHTML = time.hours;
      minutesLabel.innerHTML = time.minutes;
      secondsLabel.innerHTML = time.seconds;
      millisecondsLabel.innerHTML = time.milliseconds;
    }, 50);
    running = true;
    startStopBtn.innerHTML = "stop";
    resetLapBtn.innerHTML = "lap";
    resetLapBtn.dataset.action = "lap"
    resetLapBtn.classList.remove("stopwatch-header__btn_red");
    resetLapBtn.classList.add("stopwatch-header__btn_green");
  }

  //invokes after click on stop btn
  function stop() {
    running = false;
    clearTimeout(timer);
    previousTime = (new Date).getTime() - startTime;
    startTime = null;
    startStopBtn.innerHTML = "start";
    resetLapBtn.innerHTML = "reset";
    resetLapBtn.dataset.action = "reset";
    resetLapBtn.classList.remove("stopwatch-header__btn_green");
    resetLapBtn.classList.add("stopwatch-header__btn_red");
  }
  this.start = start;
  this.stop = stop;
  startStopBtn.addEventListener("click", function() {
      if (running) {
        stop();
      } else {
        start();
      }
  });
  //set stopwatch`s labels
  function startPosition() {
    hoursLabel.innerHTML = "00";
    minutesLabel.innerHTML = "00";
    secondsLabel.innerHTML = "00";
    millisecondsLabel.innerHTML = "000";
  }
  resetLapBtn.addEventListener("click", function() {
    if (this.dataset.action == "reset") {
      reset();
    } else if (this.dataset.action == "lap") {
      lapTime();
    }
  });
  //reset stopwatch
  function reset() {
    stop();
    previousTime = 0;
    startPosition();
    clearLap();
  }
  this.reset = reset;
  //array of lap entities
  var lap = [];
  //delete all entities
  function clearLap() {
    listDiv.innerHTML = "";
    lap = [];
    removeDownloadBtn();
  }

  function addEntity() {
    var timer = getTime();
    var dateObj = new Date();
    var time = (dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours()) + ":" +
               (dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes()) + ":" +
               (dateObj.getSeconds() < 10 ? "0" + dateObj.getSeconds() : dateObj.getSeconds());
    var date = dateObj.getFullYear() + "-" +
              (dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth()+1) : dateObj.getMonth()+1) + "-" +
              (dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate());
    var lapItem = {
      text: "",
      timer: timer.hours + ":" + timer.minutes + ":" + timer.seconds + ":" + timer.milliseconds,
      time: time,
      date: date
    };
    lap.push(lapItem);
    return lapItem;
  }
  function deleteEntity(stopwatchTime) {
    for (var i = 0; i < lap.length; i++) {
      if (lap[i].timer == stopwatchTime) {
        lap.splice(i, 1);
        if(lap.length == 0)
          removeDownloadBtn();
        return;
      }
    }
  }
  //add lap and render in interface;
  function addLapItem(lapItem) {
    if (!btnCSV)
      addDownloadBtn();
    var divItem = document.createElement("div");
    divItem.classList.add("stopwatch-list__item");
    var inputDiv = document.createElement("div");
    inputDiv.classList.add("stopwatch-list__input");
    var input = document.createElement("input");
    input.classList.add("stopwatch-list__input_inner");
    inputDiv.appendChild(input);
    var watchText = document.createElement("div");
    watchText.classList.add("stopwatch-list__watch-text");
    watchText.innerHTML = lapItem.timer;
    var time = document.createElement("div");
    time.classList.add("stopwatch-list__time");
    time.innerHTML = lapItem.time;
    var date = document.createElement("div");
    date.classList.add("stopwatch-list__date");
    date.innerHTML = lapItem.date;
    var closeBtn = document.createElement("div");
    closeBtn.classList.add("stopwatch-list__close");
    divItem.appendChild(inputDiv);
    divItem.appendChild(watchText);
    divItem.appendChild(time);
    divItem.appendChild(date);
    divItem.appendChild(closeBtn);
    listDiv.appendChild(divItem);
  }
  //invokes addEntity which provides date and then addLapItem renders interface
  function lapTime() {
    var lapItem = addEntity();
    addLapItem(lapItem);
  }
  this.lapTime = lapTime;
  //deletes entity and removes from interface lap
  function deleteLap(item) {
    deleteEntity(item.querySelector(".stopwatch-list__watch-text").innerHTML);
    item.parentNode.removeChild(item);
  }
  //event for removes laps
  elem.addEventListener("click", function(event) {
    if(!event.target.closest(".stopwatch-list__close")) return;

    var item = event.target.closest(".stopwatch-list__item");
    deleteLap(item);
  });
  //method for input event which finds entity by timer and makes entity in text field
  function writeTextInLap(text, timer) {
    for (var i = 0; i < lap.length; i++) {
      if (lap[i].timer == timer) {
        lap[i].text = text;
        return;
      }
    }
  }
  elem.addEventListener("input", function(event) {
    var elem = event.target.closest(".stopwatch-list__input_inner");
    if (!elem) return;
    var item = elem.closest(".stopwatch-list__item");
    writeTextInLap(elem.value, item.querySelector(".stopwatch-list__watch-text").innerHTML);
  });
  //variable for download CSV button
  var btnCSV;
  //adds download CSV buttton invokes if there at least one entity
  function addDownloadBtn() {
    btnCSV = document.createElement("div");
    btnCSV.innerHTML = "download CSV";
    btnCSV.classList.add("stopwatch__btn-csv");
    btnCSV.addEventListener("click", function() {
      var content = createCsvContent();
      var download = document.createElement("a");
      download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
      download.setAttribute("download", "stopwatch.csv");

      download.style.display = "none";
      document.body.appendChild(download);
      download.click();
      document.body.removeChild(download);
    });
    elem.appendChild(btnCSV);
  }
  //method for removes download CSV btn if there no entities
  function removeDownloadBtn() {
    elem.removeChild(btnCSV);
    btnCSV = null;
  }
  function createCsvContent() {
    var lineArray = [];
    //head
    lineArray.push("number,text,timer,time,date");
    lap.forEach(function (entity, index) {
      var line = (index+1) + "," + entity.text + "," + entity.timer + "," + entity.time + "," + entity.date;
      lineArray.push(line);
    });
    return lineArray.join("\n");
  }
  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
