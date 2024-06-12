const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');

const totalFloors = 50;
const floorHeight = 14;
const elevatorWidth = 10;
const elevatorHeight = 13;

let startTime = new Date();
let finishTime;
let deliveredCount = 0;

updateDeliverCount();

function run(elvIdx, row) {
  if (deliveredCount === mans.length) return;
  const m = getMan(row);
  go(elvIdx, m, function(){
    const m2 = getMan(row+1);
    if (m2 != null) {
      return run(getNextElevator(elvIdx), row+1)
    }

    finishTime = new Date();
    updateDeliverCount();
  })
}

function getMan(idx) {
  if (idx === mans.length) return null;
  return mans[idx];
}

function getNextElevator(idx) {
  if (idx === 2) return 0;
  return idx + 1;
}

// todo random
function go(idx, man, cb) {
  const elv = elevators[idx];
  // go to the man floor first
  elv.targetFloor = man.from - 1;
  mapSetIdxToElevator(idx, [function(elv) {

    setTimeout(function(){
      elv.targetFloor = man.to - 1;
      elv.targetFlag = man.to - 1
      mapClearParamsIdxElevator(idx);
      mapSetIdxToElevator(idx, [function(el){
        if ((man.to - 1) === el.currentFloor) {
          updateDeliverCount(1)
        }

        // next
        if (typeof cb === 'function') {
          setTimeout(cb, 2000);
        }
      }])
      mapCallIdxToElevator(idx);
    }, 2000)
  }]);

  mapCallIdxToElevator(idx);
}

for (let i = 0; i < elevators.length; i++) {
  run(i, i)

  drawElevator(i, 0); // Initial drawing
}

function updateDeliverCount(v) {
  if (v !== undefined && v > 0) {
    deliveredCount += v;
  }
  document.getElementById("startTime").innerHTML = startTime.toLocaleString();
  
  if (finishTime) {
    document.getElementById("finishTime").innerHTML = finishTime.toLocaleString();
    document.getElementById("gapTime").innerHTML = getDateTimeSince(startTime);
  }

  document.getElementById("counter").innerHTML = deliveredCount;
}
