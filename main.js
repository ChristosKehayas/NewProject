

function* permutator(permutation) {
    var length = permutation.length,
        c = Array(length).fill(0),
        i = 1, k, p;

    yield permutation.slice();
    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            yield permutation.slice();
        } else {
            c[i] = 0;
            ++i;
        }
    }
}



const paySettle = (participantArray) => {

    //console.log(debtObj)
    let humans = participantArray.map(x => x.name); //need to call function that will take debtInput here and will return permutated humans.
    //console.log(humans)
    let debt = participantArray.map(x => x.debt);
    let stateC = 0;
    let stateD = 0;
    let StateDim = -1;
    let negtracker = -1;
    let postracker = -1;
    let Remainder = 0;
    let storage = 0;
    let State = [];

    for (let i = 0; i < debt.length; i++) {
        if (debt[i] < 0) {
            negtracker = i;
            stateC++;

        }//end if

        for (let j = 0; j < debt.length; j++) {
            if (debt[j] > 0) {
                postracker = j;
                stateC++


            } //end if

            if (stateC > stateD && negtracker !== -1 && postracker !== -1 && debt[negtracker] !== 0 && debt[postracker] !== 0) {

                //stateC updates when a positive or negative balance has been spotted.
                //This is not enough though - it might update StateC without updating the +ve or -ve trackers (thus returnig NaNs)
                //We also don't have to loop when debt[X] is zero as acount balance has been settled.

                StateDim++
                stateD = stateC;
                Remainder = debt[negtracker] + debt[postracker];


                if (Remainder <= 0) {
                    storage = debt[postracker];
                    debt[negtracker] = Remainder;
                    debt[postracker] = 0;
                    State[StateDim] = humans[postracker] + "--> " + humans[negtracker] + " " + storage;


                } else {
                    storage = -debt[negtracker];
                    debt[negtracker] = 0;
                    debt[postracker] = Remainder;
                    State[StateDim] = humans[postracker] + "--> " + humans[negtracker] + " " + storage;


                }
                //end if 
            }//end if
        }//Next j
    }//Next i

    //console.log(State);

    return State;

}

const countPos = (arr) => {
    let poscounter = 0;
    let negcounter = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > 0) { poscounter++ } else {
            if (arr[i] < 0) { negcounter++ }

        }
    }
    return { poscounter, negcounter };
}

//not required anymore - it used to match permutated amounts with their equivalent names
// const CalcPermutatedNames = (debtObj, participantArray) => {
//     const result = debtObj.map(item => {
//         const newItem = item;
//         participantArray.forEach(item2 => {
//             if (item.debt === item2.debt) {
//                 newItem.name = item2.name;
//             }
//         });
//         return newItem
//     });

//     let newNames = [];

//     for (let i = 0; i < result.length; i++) {
//         newNames.push(result[i].name);
//     }
//     return newNames;
// }

const debtCalc = (moneySpent) => {
    let target = moneySpent.reduce(
        (accumulator, a) => accumulator + a
        , 0) / moneySpent.length;
    return moneySpent.map(x => target - x);
}

const debtCalc2 = (participantArray) => {
    let target = participantArray.reduce((acc, obj) => acc + obj.amountSpent, 0)
        / participantArray.length;
    // return target
    return participantArray.map(x => x["debt"] = target - x.amountSpent);
}


const CreateParticipant = (_name, _amount) => {
    myf: {

        if (typeof (_amount) !== "number" || _amount < 0) {
            console.log("Positive Number Required");
            break myf;
        }

        const newParticipant = new Participant(_name, _amount);
        moneySpent.push(_amount);
        participantArray.push(newParticipant);

    }

}

const trackerCalc = (participantArray) => {


    let permutatedInput = [...permutator(participantArray)].slice(0);
    // console.log(permutatedInput[0].slice(0))
    console.log(permutatedInput[0].slice(0))
    let minL = paySettle(permutatedInput[0].slice(0)).length;
    let maxL = Math.max(countPos(permutatedInput[0].slice(0).map(x => x.debt)).poscounter, countPos(permutatedInput[0].slice(0).map(x => x.debt)).negcounter);
    let result = paySettle(permutatedInput[0].slice(0));
    for (let i = 1; i < permutatedInput.length; i++) {

        if (paySettle(permutatedInput[i].slice(0)).length <= maxL) {
            // result=[];
            result = (paySettle(permutatedInput[i].slice(0)));
            break;
        } else {
            if (paySettle(permutatedInput[i].slice(0)).length <= minL) {
                //result=[];
                minL = paySettle(permutatedInput[i].slice(0)).length;
                result = paySettle(permutatedInput[i].slice(0));
            }
        }
    }

    return result;

}

let Participant = class {

    constructor(name, amountSpent) {
        this.name = name;
        this.amountSpent = amountSpent;
    }
}

let Debt = class {
    constructor(debt) {
        this.debt = debt;
    }
}
//Main 

let participantArray = [];
let moneySpent = [];

CreateParticipant("A", 30);
CreateParticipant("B", 40);
CreateParticipant("C", 0);
CreateParticipant("D", 10);
CreateParticipant("E", 30);
CreateParticipant("F", 50);
CreateParticipant("G", 0);

let debt = debtCalc(moneySpent);

let debt2 = debtCalc2(participantArray);

//console.log("debt", debt)
// console.log("debt2",debt2)
// console.log("new participat array",participantArray)

const finalCalc = () => {

    for (let i = 0; i < debt.length; i++) {

        participantArray[i].debt = debt[i]; //this can be replaced by how debt2 is calculating participantArray.
    }

    console.log(trackerCalc(participantArray));
}


finalCalc();
