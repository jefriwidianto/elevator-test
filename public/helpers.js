function getDaysInMonth(month,year) {     
    if( typeof year == "undefined") year = 1999; // any non-leap-year works as default     
    var currmon = new Date(year,month),     
        nextmon = new Date(year,month+1);
    return Math.floor((nextmon.getTime()-currmon.getTime())/(24*3600*1000));
} 
function getDateTimeSince(target) { // target should be a Date object
    var now = new Date(), diff, yd, md, dd, hd, nd, sd, out = [];
    diff = Math.floor(now.getTime()-target.getTime()/1000);
    yd = target.getFullYear()-now.getFullYear();
    md = target.getMonth()-now.getMonth();
    dd = target.getDate()-now.getDate();
    hd = target.getHours()-now.getHours();
    nd = target.getMinutes()-now.getMinutes();
    sd = target.getSeconds()-now.getSeconds();
    if( md < 0) {yd--; md += 12;}
    if( dd < 0) {
        md--;
        dd += getDaysInMonth(now.getMonth()-1,now.getFullYear());
    }
    if( hd < 0) {dd--; hd += 24;}
    if( md < 0) {hd--; md += 60;}
    if( sd < 0) {md--; sd += 60;}

    if( yd > 0) out.push( yd+" year"+(yd == 1 ? "" : "s"));
    if( md > 0) out.push( md+" month"+(md == 1 ? "" : "s"));
    if( dd > 0) out.push( dd+" day"+(dd == 1 ? "" : "s"));
    if( hd > 0) out.push( hd+" hour"+(hd == 1 ? "" : "s"));
    if( nd > 0) out.push( nd+" minute"+(nd == 1 ? "" : "s"));
    if( sd > 0) out.push( sd+" second"+(sd == 1 ? "" : "s"));
    return out.join(" ");
}

function drawElevatorBox(xPos, yPos, wVal, hVal) {
    ctx.fillStyle = 'red';
    ctx.fillRect(xPos, yPos, wVal, hVal);
}

function setElevatorParams(idx, ...params) {
    elevatorParams[idx] = params;
}

function getElevatorParams(idx) {
    return elevatorParams[idx];
}

function clearElevatorParams(idx) {
    if (idx === 0) {
        elevatorParams[0] = []
    }

    if (idx === 1) {
        elevatorParams[1] = []
    }

    if (idx === 2) {
        elevatorParams[2] = []
    }
}

function animateElevator1(){
    animateElevator.apply(null, [0, ...getElevatorParams(0)])
}
function animateElevator2(){
    animateElevator.apply(null, [1, ...getElevatorParams(1)])
}
function animateElevator3(){
    animateElevator.apply(null, [2, ...getElevatorParams(2)])
}

function mapSetIdxToElevator(idx, params) {
    setElevatorParams(idx, ...params);
}

function mapClearParamsIdxElevator(idx) {
    clearElevatorParams(idx)
}

function mapCallIdxToElevator(idx) {
    if (idx === 2) {
        animateElevator3()
    }

    if (idx === 1) {
        animateElevator2()
    }

    if (idx === 0) {
        animateElevator1()
    }
}

function animateElevator(idx, cb) {
    const obj = elevators[idx];

    obj.state = 1;

    if (obj.currentFloor < obj.targetFloor) {
        let gap = obj.targetFloor - obj.currentFloor; // 50 - 10 = 40
        let inLinear = parseInt(obj.targetFloor / 5) // 50 / 5 = 10
        if (gap < 5) {
            // slower movement on near floor
            obj.currentFloor += 0.1; // Speed of the elevator
        } else if (obj.currentFloor === 0 && obj.currentFloor <= inLinear) {
            obj.currentFloor += 0.1
        } else if (obj.currentFloor > 0 && (obj.currentFloor - 5) < inLinear) {
            obj.currentFloor += 0.1;
        } else {
            obj.currentFloor += 0.2; // Speed of the elevator
        }
        if (obj.currentFloor > obj.targetFloor) obj.currentFloor = obj.targetFloor;
    } else if (obj.currentFloor > obj.targetFloor) {
        let gap = (obj.currentFloor - obj.targetFloor)
        if (obj.previousFloor > 0) {
            let inLinear = parseInt(obj.previousFloor/ 5)
            if (gap < 5) {
                obj.currentFloor -= 0.1; // Speed of the elevator
            } else if (obj.currentFloor > parseInt(inLinear * 5)) {
                obj.currentFloor -= 0.1;
            } else {
                obj.currentFloor -= 0.2; // Speed of the elevator
            }
        } else {
            if (gap < 5) {
                obj.currentFloor -= 0.1; // Speed of the elevator
            } else {
                obj.currentFloor -= 0.2; // Speed of the elevator
            }
        }

        if (obj.currentFloor < obj.targetFloor) {
            obj.currentFloor = obj.targetFloor;
        }
    }

    drawElevator();

    if (obj.currentFloor !== obj.targetFloor) {
        obj.animationId = requestAnimationFrame(eval('animateElevator'+(idx+1)));
    } else {
        obj.previousFloor = obj.currentFloor;
        cancelAnimationFrame(obj.animationId);

        obj.state = 0;
        if (typeof cb === 'function') cb(obj);
    }
}

function drawElevator() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    for (let i = 0; i < totalFloors; i++) {
        const yPosition = canvas.height - (i + 1) * floorHeight;
        ctx.fillText(`Floor ${i+1}`, 10, yPosition + floorHeight - 2);

        ctx.beginPath();
        ctx.moveTo(0, yPosition);
        ctx.lineTo(canvas.width, yPosition);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(110, yPosition)
        ctx.lineTo(110, yPosition+canvas.height)
        ctx.stroke();
    }

    let gapBetween = 0;

    for (let idx = 0; idx < elevators.length; idx++) {
        if (idx > 0) {
            gapBetween = idx * 15;
        }
        const pos = 55 + gapBetween;
        const obj = elevators[idx]
        drawElevatorBox(pos,canvas.height - (obj.currentFloor + 1) * floorHeight + (floorHeight - elevatorHeight), elevatorWidth, elevatorHeight)

        if (obj.targetFlag !== obj.targetFloor) {
            ctx.fillText('Waiting', 120,  canvas.height - obj.targetFloor * floorHeight);
        }

        ctx.stroke()
    }
}
