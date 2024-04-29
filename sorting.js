var svg,
  bandScale,
  text,
  maxElement = 15,
  dataRange = maxElement * 2,
  areaHeight = 250,
  areaWidth = 800,
  time = 300,
  traverseColor = "#ffcaa1",
  smallestColor = "#ab87ff",
  unsortedColor = "#add8e6",
  sortedColor = "#56b4d3",
  isSorting = false,
  isFound = false;

var swooshAudio = new Audio("./sound-effects/swoosh.mp3");
var completeAudio = new Audio("./sound-effects/complete.mp3");
swooshAudio.volume = 0.3;
completeAudio.volume = 0.3;

// generating random data
var data = randomData(maxElement, dataRange);
function setSpeed() {
  time = 1000 - document.getElementById("speed").value;
}
//a d3 function for scaling height for all the data this function
var heightScale = d3
  .scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, areaHeight]);

// initialized a chart with random value
createChart(data);

// javascript objects for performing different sorting algorithm
const SortAlgo = {
  // bubble sort methods to perform bubble sort algorithm
  bubbleSort() {
    // promise for async bubble sort with delay

    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    // async function for bubble sort

    async function sort(self) {
      var temp;
      for (let i = 0; i < data.length - 1; i++) {
        // If user click on stop button then this function will stop performing here.
        if (self.abort) {
          self.abort = false;
          return;
        }
        // changing initial smallest bar color
        changeBarColor(data[0], smallestColor);
        await timer(time);
        for (j = 0; j < data.length - i - 1; j++) {
          // If user click on stop button then this function will stop performing here.
          if (self.abort) {
            self.abort = false;
            changeBarColor(data[j], unsortedColor);
            return;
          }
          await timer(time);
          changeBarColor(data[j + 1], traverseColor);
          await timer(time);
          if (data[j] > data[j + 1]) {
            temp = data[j];
            data[j] = data[j + 1];
            data[j + 1] = temp;
            changeBarColor(data[j + 1], smallestColor);
            swooshAudio.play();
            swapBar(data);
            await timer(time);
          } else {
            changeBarColor(data[j + 1], smallestColor);
          }
          changeBarColor(data[j], unsortedColor);
        }
        changeBarColor(data[j], sortedColor);
      }

      // after complete sorting complete making all the bar green and playing complete sound effects
      svg.selectAll("rect").style("fill", "#56b4d3");

      completeAudio.play();
      isSorting = false;
      isFound = true;
      togglePlay();
    }

    // calling async function here
    sort(this);
  },

  // selection sort methods
  selectionSort() {
    // promise for async selection sort with delay
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));

    // async function for selection sort algorithm
    async function sort(self) {
      for (let i = 0; i < data.length; i++) {
        // Stoping execution here if users wants to stop.
        if (self.abort) {
          self.abort = false;
          return;
        }
        smallest = data[i];
        pos = i;
        changeBarColor(smallest, smallestColor);
        await timer(time);
        for (var j = i + 1; j < data.length; j++) {
          if (self.abort) {
            self.abort = false;
            return;
          }
          changeBarColor(data[j], traverseColor);
          if (smallest > data[j]) {
            await timer(time);
            changeBarColor(smallest, unsortedColor);
            smallest = data[j];
            pos = j;
          }

          changeBarColor(smallest, smallestColor);
          await timer(time);
          changeBarColor(data[j], unsortedColor);
        }
        if (data[i] != smallest) {
          temp = data[i];
          data[i] = smallest;
          data[pos] = temp;
          // playing swapping sound
          swooshAudio.play();
        }
        // swapping bar and changing smallest color
        changeBarColor(smallest, sortedColor);
        swapBar(data);
        await timer(time); // then the created Promise can be awaited
      }

      // After complete sorting algorithm making all the bar green.
      svg.selectAll("rect").style("fill", "#56b4d3");

      completeAudio.play();
      isSorting = false;
      isFound = true;
      togglePlay();
    }
    // calling sort function here
    sort(this);
  },


  // If user wants to stop the sorting process then this function will be called and sorting algorithm will be stopped immediately.
  sortStop() {
    this.abort = true;
    isSorting = false;
  },
};

function stopSorting() {
  const stopSorting = SortAlgo.sortStop.bind(SortAlgo);
  stopSorting();
}
function startSorting() {
  let algo = document.getElementById("get-algo").value;
  if (algo == "bubble-sort") {
    const bubbleSortStarted = SortAlgo.bubbleSort.bind(SortAlgo);
    bubbleSortStarted();
  } else if (algo == "selection-sort") {
    const selectionSortStarted = SortAlgo.selectionSort.bind(SortAlgo);
    selectionSortStarted();
  } else if (algo == "merge-sort") {
    const mergeSortStarted = SortAlgo.mergeSort.bind(SortAlgo);
    mergeSortStarted();
  }
}

document.getElementById("sort").addEventListener("click", function () {
  isSorting = true;
  startSorting();
  togglePlay();
});

document.getElementById("stop").addEventListener("click", function () {
  if (isSorting) {
    stopSorting();
    togglePlay();
  }
});

document.getElementById("random-data").addEventListener("click", function () {
  if (isSorting) {
    stopSorting();
    togglePlay();
  }
  if (isFound) {
    isFound = false;
    document.getElementById("sort").classList.remove("none");
  }
  svg.remove();
  var data = randomData(maxElement, dataRange);
  createChart(data);
});

document.getElementById("sound").addEventListener("click", function () {
  if (this.classList.contains("line-through")) {
    swooshAudio.volume = 0.3;
    completeAudio.volume = 0.3;
  } else {
    swooshAudio.volume = 0;
    completeAudio.volume = 0;
  }
  this.classList.toggle("line-through");
});