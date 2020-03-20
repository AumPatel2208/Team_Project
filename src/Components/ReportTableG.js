import React, { Component, Fragment, } from 'react';
import { Container, Table, Button } from 'reactstrap';
import axios from 'axios';
import {
    Form,
    FormGroup,
    Dropdown, FormControl, FormLabel
} from 'react-bootstrap';

const _ = require('lodash'); //Library to Change Cases of things

let apiLinks = require('../api/config.json');
export default class ReportTableG extends Component {
    //Set the state to an empty list of objects that will be taken from the database
    state = {
        sales: [],
        saleT: 'saleType',
        dates: 'saleDate',
        dateinput: '',
        saleTypeValue: 'Choose Sale Type',
        summedValues: [
            {advisorCode: 78, "paymentMethod": "cash", "fare": 1234567, "saleNum": 0}
        ],
        dict: {},
    };

    //runs when component mounts, use to gets the data from db
    componentDidMount() {
        axios.get(apiLinks.SALES).then(res => {
            const sales = res.data;
            this.setState({ sales });
        });
    }
    onOpenClick(e, _id) {
        console.log(e, _id);
    }

    addPayment(){
        if (this.state.paymentMethod === "creditCard") {
            this.state.dict["credit"] += this.state.fare;
        } else if (this.state.paymentMethod === "cheque") {
            this.state.dict["cheque"] += this.state.fare;
        } else if (this.state.paymentMethod === "cash") {
            this.state.dict["cash"] += this.state.fare;
        }
        this.state.dict["saleNum"] += 1;
        this.state.dict["total"] += this.state.dict["fare"];
    }
    aggregateSales(){
        var x;
        while (x=0, x< this.state.sales.length, x++) {
            if (this.state.dict["advisorCode"] === this.state.sales.advisorCode) {
                this.addPayment();
            }
            else{
                this.state.dict = {"advisorCode": this.state.advisorCode, "cash":0, "credit":0, "cheque":0, "saleNum": 0,"total": 0};
                this.addPayment();
                this.state.summedValues.push(this.state.dict);
            }
        }

   }


    render() {
        const row = (
            _id,
            advisorCode,
            saleNum,
            currency,
            USDExchangeRate,
            commissionRate,
            saleDate,
            cash,
            credit,
            cheque,
            total
        ) => (
            <Fragment>
                <tr key={_id}>
                    <td>{advisorCode}</td>
                    <td>{saleNum}</td>
                    <td>{currency}</td>
                    <td>{USDExchangeRate}</td>
                    <td>{commissionRate}</td>
                    <td>{saleDate}</td>
                    <td>{cash}</td>
                    <td>{credit}</td>
                    <td>{cheque}</td>
                    <td>{total}</td>
                    <td>
                        <Button
                            className="open-btn"
                            color="primary"
                            size="sm"
                            onClick={this.onOpenClick.bind(this, advisorCode)}
                        >
                            open
                        </Button>
                    </td>
                </tr>
            </Fragment>
        );

        return (
            <Container>
                <Form>
                    <FormGroup controlId="saleT" bssize="large">
                        <Dropdown
                            onSelect={key => {
                                this.setState({saleTypeValue: key});
                                if (key === "Interline") {
                                    this.setState({
                                        sales: this.state.sales.filter(
                                            sale =>
                                                String(sale[this.state.saleT]) ===
                                                "Interline")
                                    });
                                } else {
                                    this.setState({
                                        sales: this.state.sales.filter(
                                            sale =>
                                                String(sale[this.state.saleT]) ===
                                                "Domestic")
                                    });
                                }}}>
                            <Dropdown.Toggle
                                variant="success"
                                id="dropdown-basic"
                            >
                                {_.startCase(this.state.saleTypeValue)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Domestic">
                                    Domestic
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="Interline">
                                    Interline
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>


                        <FormLabel>Enter Start Date: DD/MM/YYYY</FormLabel>
                        <FormControl
                            autoFocus
                            type="string"
                            value={this.state.sales.dateinput}
                            onChange={e => {
                                this.setState({
                                    dateinput: e.target.value
                                });
                            }}
                        />
                        <Button
                            bssize="medium"
                            variant="outline-danger"
                            onClick={() => this.setState({
                                sales: this.state.sales.filter(
                                    sale =>
                                        String(sale[this.state.dates]) ===
                                        String(this.state.dateinput))
                            })}
                        >
                            Enter Date
                        </Button>{''}


                        <Button
                            bssize="medium"
                            variant="outline-danger"
                            onClick={() => this.aggregateSales()
                            }
                        >

                            Generate Report
                        </Button>{''}
                    </FormGroup>

                </Form>
                <Table className="mt-4">

                    <thead>
                    <tr>
                        <th>Advisor Code</th>
                        <th>Sales</th>
                        <th>Currency</th>

                        <th>USD Exchange Rate</th>
                        <th>Commission Rate</th>
                        <th>Sale Date</th>
                        <th>Credit</th>
                        <th>Cash</th>
                        <th>Cheque</th>
                        <th>USD Total</th>
                    </tr>
                    </thead>
                    <tbody>
                            <Fragment key={this.state.sales.advisorCode}>
                                {row(
                                    this.state.summedValues[0]["advisorCode"],
                                    this.state.summedValues["saleNum"],
                                    this.state.summedValues["cash"],
                                    this.state.summedValues["credit"],
                                    this.state.summedValues["cheque"],

                                )}
                            </Fragment>
                    </tbody>
                </Table>
            </Container>
        );
    }
}

