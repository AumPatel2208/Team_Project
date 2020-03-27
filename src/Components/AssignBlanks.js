import {Container} from "reactstrap";
import {Button, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import DatePicker from "react-datepicker";
import React, {Component, Fragment} from "react";
import axios from "axios";

let apiLinks = require('../api/config.json');

export default class AssignBlanks extends Component{
    state = {
        batchValues: "",
        date: new Date(),
        code: "",
        oG: ""

    };
    //runs when component mounts, use to gets the data from db
/*
    componentDidMount() {
        let start = this.state.startDate;
        let end = this.state.endDate;

        axios.get( apiLinks.BLANKS +'/byDate',{params:{start, end}}).then(res => {
            const blanks = res.data;
            this.setState({blanks});
        });
    }

 */




findInitBatch(e) {
console.log("hello")
    axios.get(apiLinks.BLANKS + '/assign', {params:{start:1,end:2}}).then(resp => {
        const blanks = resp.data;
        console.log(blanks);


    });

    /*
    axios.get( apiLinks.BLANKS ).then(res => {
        const blanks = res.data;
        this.setState({blanks});
    });


    var y = String(this.state.batchValues).split("-");

    var start = y[0];
    var end = y[1];
    axios.get(apiLinks.BLANKS + '/assign', {params: {start, end}})
        .then(function(response) {
            return response
        });

            //response => {console.log(response.data);
       // const oG = a.data;
       // this.setState({oG});

   // })
    console.log(this.state.oG)
//})

     */
}


updateInitBatch(e){

    //this.findInitBatch(e);

    var y = String(this.state.batchValues).split("-");


    var st = y[0];
    var en = y[1];

    var s = this.state.oG.batchStart;
    var e =  this.state.oG.batchEnd;

    var x = this.state.oG.remaining;
console.log(this.state.oG);
console.log(x);

var z = x.length;

    var i =0;
    for(i = 0; i < z; i++){
        if (st <= s && en>= e){
            if (st != s-1 && en !=e+1){
                //if taking the entire batch
                if(st == s && en == e){
                    x[i].pop()
                }
                //if taking a middle portion
                else {
                    x[i] = {start: st, end: s - 1}
                    x.push({start: e + 1, end: en})
                }
            }
            //leaving only one at beginning
            else if (st == s-1){
                if (en == e+1){
                    x[i] = {start: st, end: st}
                    x.push({start: en, end: en})
                }
                //not leaving any at the end
                else if (en == e){
                    x[i] = {start: st, end: st}
                }
            }
            //none at start, check for end
            else if (st == s){
                if (en == e+1){
                    x[i] = {start: en, end: en};
                }
            }
        }
    }

this.setState({remaining: x});

    var iden = this.state.oG.id;
    axios.put(apiLinks.BLANKS + '/id', {params: {iden}}, this.state.oG ).then(response => {
        console.log(response);
});
}





    handleSubmit(event) {
        const assignBlanks ={
            batchValues: this.state.batchValues,
            advisorCode: this.state.code,
            date: this.state.date,
            batchId: this.state.oG.id
        };

        event.preventDefault();
        console.log('hello');

        axios.post(apiLinks.ASSIGN,assignBlanks).then(response => {
            console.log(response);
        });

    }

    handleReAssignSubmit(event) {
        event.preventDefault();
        console.log('hello');

       //ADD REASSIGN HEREEEEEEEEEEEEEEE

    }


    render() {

        return (
            <Container>
                <h3>Assign Blanks</h3>
                <FormGroup controlId="username" bssize="large">
                    <FormLabel>Batch</FormLabel>
                    <FormControl
                        autoFocus
                        type="batchValues"
                        value={this.state.batchValues}
                        onChange={e => this.setState({batchValues: e.target.value, date: Date.now()})}
                    />
                </FormGroup>
                <FormGroup controlId="date" bssize="large">
                    <FormLabel>Advisor Code</FormLabel>
                    <FormControl
                        selected = {this.state.code}
                        onChange={ e=>
                            this.setState({code: e.target.value})
                        }

                    />
                </FormGroup>
                <Button
                    onClick={e => {
                        console.log("hit");
                      //  this.handleSubmit(e);
                        //this.updateInitBatch(e)
                        this.findInitBatch(e)
                    }}
                >
                    Assign Blanks
                </Button>
                <br></br>
                <br/>




                <h3>Re-assign Blanks</h3>
                <FormGroup controlId="username" bssize="large">
                    <FormLabel>Batch</FormLabel>
                    <FormControl
                        autoFocus
                        type="batchValues"
                        value={this.state.batchValues}
                        onChange={e => this.setState({batchValues: e.target.value, date: Date.now()})}
                    />
                </FormGroup>
                <FormGroup controlId="date" bssize="large">
                    <FormLabel>Initial Advisor's Code</FormLabel>
                    <FormControl
                        selected = {this.state.advisorCode}
                        onChange={ e=>
                            this.setState({advisorCode: e.target.value})
                        }

                    />
                </FormGroup>
                <FormGroup controlId="date" bssize="large">
                    <FormLabel>New Advisor's Code</FormLabel>
                    <FormControl
                        selected = {this.state.advisorCode}
                        onChange={ e=>
                            this.setState({advisorCode: e.target.value})
                        }

                    />
                </FormGroup>
                <Button
                    onClick={e => {
                        this.handleReAssignSubmit(e)
                    }}
                >
                    Re-assign Blanks
                </Button>


            </Container>

        )
    }}