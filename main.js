

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

const paySettle = (debtInput,participantArray)=>{
  
    let debtObj = debtInput.map(item=>{
        let newDebt = new Debt(item)
        return newDebt;
    });
    
    let humans= CalcPermutatedNames(debtObj,participantArray); //need to call function that will take debtInput here and will return permutated humans.   
    let debt=debtInput;
    let stateC=0;
    let stateD=0;
    let StateDim=-1;
    let negtracker=-1;
    let postracker=-1;
    let Remainder=0;
    let storage=0;
    let State=[];

    for (let i=0;i<debt.length;i++){
        if (debt[i]<0){
            negtracker=i;
            stateC++;
            
        }//end if
        
        for (let j=0;j<debt.length;j++){
            if(debt[j]>0){
               postracker=j;
               stateC++
                
             
            } //end if
    
            if (stateC>stateD && negtracker!==-1 && postracker!==-1 && debt[negtracker]!==0 && debt[postracker]!==0){
    
                    //stateC updates when a positive or negative balance has been spotted.
                    //This is not enough though - it might update StateC without updating the +ve or -ve trackers (thus returnig NaNs)
                    //We also don't have to loop when debt[X] is zero as acount balance has been settled.
                    
                    StateDim++
                    stateD=stateC;
                    Remainder=debt[negtracker]+debt[postracker];
    
                   
                    if(Remainder<=0){
                        storage =debt[postracker];
                        debt[negtracker]=Remainder;
                        debt[postracker]=0;
                        State[StateDim]=humans[postracker]+ "--> "+ humans[negtracker]+" " +storage;
                       
                        
                        } else {
                            storage=-debt[negtracker];
                            debt[negtracker]=0;
                            debt[postracker]=Remainder;
                            State[StateDim]=humans[postracker]+ "--> "+ humans[negtracker]+ " "+storage;
                     
                         
                        }
                        //end if 
            }//end if
        }//Next j
    }//Next i
    
     //console.log(State);
    
     return State;
    
    }

const countPos = (arr)=>{
        let poscounter=0;
        let negcounter=0;
        for (let i =0; i<arr.length;i++){
          if(arr[i]>0){poscounter++}else{
            if(arr[i]<0){negcounter++}
            
          }
        }   
        return {poscounter, negcounter};
    }
      
 const CalcPermutatedNames = (debtObj, participantArray)=>{
        const result = debtObj.map(item=>{
            const newItem=item;
                participantArray.forEach(item2=>{
                if(item.debt===item2.debt){
                    newItem.name=item2.name;
                }
            }); 
            return newItem 
        });
        
        let newNames=[];
        
            for (let i =0;i<result.length;i++){
            newNames.push(result[i].name);
            }
         return newNames;   
    }  
    
const debtCalc = (moneySpent)=>{   
        let target=moneySpent.reduce(
        (accumulator, a) => accumulator+a  
              ,0)/moneySpent.length; 
        
    return moneySpent.map(x=>target-x);
    }


const CreateParticipant = (_name, _amount)=>{ myf:{

        if (typeof(_amount)!=="number" || _amount<0){
            console.log("Positive Number Required");
            break myf;
        }
    
        const newParticipant = new Participant(_name, _amount);

        moneySpent.push(_amount); 
        participantArray.push(newParticipant);

        
     }    

    }

const trackerCalc=(debtInput,participantArray)=>{
  
        let permutatedInput= [...permutator(debtInput)].slice(0);   
        let minL=paySettle(permutatedInput[0].slice(0),participantArray).length;
        let maxL=Math.max(countPos(debtInput).poscounter, countPos(debtInput).negcounter);
        let result=paySettle(permutatedInput[0].slice(0),participantArray);
        
        
          for (let i=1; i<permutatedInput.length;i++){   
            
          if(paySettle(permutatedInput[i].slice(0),participantArray).length<=maxL ){
           // result=[];
            result=(paySettle(permutatedInput[i].slice(0),participantArray));
            break;
          }else{
            if(paySettle(permutatedInput[i].slice(0),participantArray).length<=minL){  
              //result=[];
              minL=paySettle(permutatedInput[i].slice(0),participantArray).length;
              result=(paySettle(permutatedInput[i].slice(0),participantArray));
            }
          }
        }
        
        return result;
        
    }

let Participant= class {

        constructor(name, amountSpent){
        this.name=name;
        this.amountSpent=amountSpent;
            }
        }
    
let Debt = class {
        constructor(debt){
        this.debt=debt;
            }
        }
 //Main 

let participantArray=[];
let moneySpent=[];

 CreateParticipant("C", 30);
 CreateParticipant("D", 40);
 CreateParticipant("E",0);
 CreateParticipant("A", 10);
 CreateParticipant("B", 20);
 CreateParticipant("F", 50);
 CreateParticipant("G", 0);

let debt=debtCalc(moneySpent);

const finalCalc = ()=>{

    for (let i =0; i<debt.length;i++){

        participantArray[i].debt=debt[i];
       }
 console.log(trackerCalc(debt,participantArray));
}


finalCalc();
