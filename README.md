# Stopwatch in pure javascript

![Alt text](stopwatch_screen.jpg?raw=true "widget stopwatch")

It is simple stopwatch widget written in pure javascript. You can add it with following steps:
1.Add div in your html

```html
  <div id="stopwatch-widget"></div>
```

2.Add script to your html

```html
  <script src="script/stopwatch.js"></script>
```
3.Use your script with following lines of code

```javascript
  var options = {
    {elem: document.querySelector("#stopwatch-widget")}
  }
  var stopwatch = new Stopwatch(options);
```
Object stopwatch has next public methods

* start()
* stop()
* reset()
* lapTime()

It is unique stopwatch widget because you can download csv file with your laps

Example:
![Alt text](stopwatch_csv_screen.jpg?raw=true "widget stopwatch")
