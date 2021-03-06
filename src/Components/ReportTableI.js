import React, { Component, Fragment, ReactPropTypes } from 'react';
import { Table } from 'reactstrap';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
//import {html2canvas, jsPDF} from  'app/ext'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import {
    Form,
    FormGroup,
    Dropdown,
    FormControl,
    FormLabel,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';

const _ = require('lodash'); //Library to Change Cases of things

let apiLinks = require('../api/config.json');

// Report Table
export default class ReportTableI extends Component {
    constructor(props) {
        super(props);
        this.toPDF = this.toPDF.bind(this);
        this.toPDFB = this.toPDFB.bind(this);

        //Set the state to an empty list of objects that will be taken from the database
        this.state = {
            sales: [],
            sales2: [],
            salesTemp: [],
            salesTemp2: [],
            saleT: 'saleType',
            code: 'advisorCode',
            inputCode: '',
            saleTypeValue: 'Choose Sale Type',
            startDate: new Date(),
            endDate: new Date(),
            sType: '',
            check: false,
        };
    }

    //runs when component mounts, use to gets the data from db
    componentDidMount() {
        axios
            .get(apiLinks.SALES)
            .then((res) => {
                const salesTemp = res.data;
                this.setState({ salesTemp });
                this.setState({ salesTemp2: salesTemp });

                const l = this.state.salesTemp.filter(
                    (i) => i.saleType == 'Domestic'
                );
                this.setState({ salesTemp: l });

                const d = this.state.salesTemp2.filter(
                    (i) => i.saleType == 'Interline'
                );
                this.setState({ salesTemp2: d });
            })
            .catch((err) => console.log('Error code: ', err));
    }

    //checking if displaying fare for cash or credit
    cashCheck(paymentMethod, fare) {
        if (paymentMethod === 'Cash') {
            return fare;
        } else {
            return 0;
        }
    }

    creditCheck(paymentMethod, fare) {
        if (paymentMethod === 'CreditCard') {
            return fare;
        } else {
            return 0;
        }
    }
    //checkign which commission to display the fare with
    commissionCheck10(commission, fare) {
        if (commission == '10') {
            return fare;
        } else {
            return 0;
        }
    }
    commissionCheck15(commission, fare) {
        if (commission == '15') {
            return fare;
        } else {
            return 0;
        }
    }

    commissionCheck9(commission, fare) {
        if (commission == '9') {
            return fare;
        } else {
            return 0;
        }
    }
    commissionCheck5(commission, fare) {
        if (commission == '5') {
            return fare;
        } else {
            return 0;
        }
    }

    roleHandler() {
        //handles the display of report (travel advisor can only access their own, whereas the office manager can
        //search for a specific advisor code

        var ad;
        {
            this.props.staff !== undefined
                ? (ad = `${this.props.staff.staffType}`)
                : (ad = 'undefined');
        }
        if (ad !== 'TravelAdvisor') {
            return (
                <Fragment>
                    <FormLabel>Enter Advisor Code</FormLabel>
                    <FormControl
                        autoFocus
                        type="string"
                        value={this.state.code}
                        onChange={(e) => {
                            this.setState({
                                code: e.target.value,
                            });
                        }}
                    />
                    <Button
                        bssize="medium"
                        variant="outline-danger"
                        onClick={() => {
                            //filtering dates
                            this.dateHandling();
                        }}
                    >
                        Filter Report
                    </Button>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <Button
                        bssize="medium"
                        variant="outline-danger"
                        onClick={() => {
                            this.dateHandling();
                        }}
                    >
                        Enter Dates
                    </Button>
                </Fragment>
            );
        }
    }

    aggregate(value) {
        //adding totals for total table at the end - DOMESTIC
        let x = 0;
        if (value === 1) {
            for (var i = 0; i < this.state.sales.length; i++) {
                x += parseFloat(this.state.sales[i].fare);
            }
            return x;
        } else if (value === 2) {
            for (var i = 0; i < this.state.sales.length; i++) {
                let y =
                    parseFloat(this.state.sales[i].fare) *
                    parseFloat(this.state.sales[i].USDExchangeRate);
                x += y;
            }
            return x;
        } else if (value === 3) {
            for (var i = 0; i < this.state.sales.length; i++) {
                if (this.state.sales[i].paymentMethod === 'Cash') {
                    x += parseFloat(this.state.sales[i].fare);
                }
                i++;
            }
            return x;
        } else if (value === 4) {
            for (var i = 0; i < this.state.sales.length; i++) {
                if (this.state.sales[i].paymentMethod === 'CreditCard') {
                    x += parseFloat(this.state.sales[i].fare);
                }
            }
            return x;
        } else if (value === 5) {
            for (var i = 0; i < this.state.sales.length; i++) {
                x += parseFloat(this.state.sales[i].otherTax);
            }
            return x;
        } else if (value === 6) {
            for (var i = 0; i < this.state.sales.length; i++) {
                if (this.state.sales[i].commissionRate == 9) {
                    x += this.state.sales[i].fare;
                }
            }
            return x;
        } else if (value === 7) {
            for (var i = 0; i < this.state.sales.length; i++) {
                if (this.state.sales[i].commissionRate == 5) {
                    x += this.state.sales[i].fare;
                }
            }
            return x;
        } else if (value === 8) {
            for (var i = 0; i < this.state.sales.length; i++) {
                if (this.state.sales[i].paymentMethod === 'CreditCard') {
                    x +=
                        parseFloat(this.state.sales[i].fare) *
                        parseFloat(this.state.sales[i].USDExchangeRate);
                }
            }
            return x;
        }
        return x;
    }

    aggregate2(value) {
        //adding totals for total table at the end - INTERLINE

        let x = 0;
        if (value === 1) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                x += parseFloat(this.state.sales2[i].fare);
            }
            return x;
        } else if (value === 2) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                let y =
                    parseFloat(this.state.sales2[i].fare) *
                    parseFloat(this.state.sales2[i].USDExchangeRate);
                x += y;
            }
            return x;
        } else if (value === 3) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                if (this.state.sales2[i].paymentMethod === 'Cash') {
                    x += parseFloat(this.state.sales2[i].fare);
                }
                i++;
            }
            return x;
        } else if (value === 4) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                if (this.state.sales2[i].paymentMethod === 'CreditCard') {
                    x += parseFloat(this.state.sales2[i].fare);
                }
            }
            return x;
        } else if (value === 5) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                x += parseFloat(this.state.sales2[i].otherTax);
            }
            return x;
        } else if (value === 6) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                if (this.state.sales2[i].commissionRate == 9) {
                    x += this.state.sales2[i].fare;
                }
            }
            return x;
        } else if (value === 7) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                if (this.state.sales2[i].commissionRate == 10) {
                    x += this.state.sales2[i].fare;
                }
            }
            return x;
        } else if (value === 8) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                x += parseFloat(this.state.sales2[i].localTax);
            }
            return x;
        } else if (value === 9) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                if (this.state.sales2[i].commissionRate == 15) {
                    x += this.state.sales2[i].fare;
                }
            }
            return x;
        } else if (value === 10) {
            for (var i = 0; i < this.state.sales2.length; i++) {
                if (this.state.sales2[i].paymentMethod === 'CreditCard') {
                    let y =
                        parseFloat(this.state.sales2[i].fare) *
                        parseFloat(this.state.sales2[i].USDExchangeRate);
                    x += y;
                }
                return x;
            }
        }
        return x;
    }

    //to get the document into a pdf
    toPDF() {
        var pdf = new jsPDF('l', 'pt', 'A4');
        pdf.setFontSize(10);
        pdf.text('Individual Domestic Report', 50, 20);
        var source = document.getElementById('export');
        pdf.autoTable({ html: '#export' });
        pdf.autoTable({ html: '#export2' });
        pdf.save('DomesticIndividualReport.pdf');
    }

    // Create PDF file
    toPDFB() {
        var pdf = new jsPDF('l', 'pt', 'A4');
        pdf.setFontSize(9);
        pdf.text('Individual Interline Report', 50, 20);
        pdf.autoTable({ html: '#exportB' });
        pdf.autoTable({ html: '#exportB3' });
        pdf.autoTable({ html: '#exportB2' });
        pdf.save('InterlineIndividualReport.pdf');
    }

    onOpenClick(e, _id) {
        console.log(e, _id);
    }

    dateHandling() {
        let a;
        let w;

        //setting code based on if given (advisor) or entered (manager)
        {
            this.props.staff !== undefined
                ? (a = `${this.props.staff.staffType}`)
                : (a = '');
        }

        if (a == 'TravelAdvisor') {
            this.props.staff !== undefined
                ? (w = `${this.props.staff.advisorCode}`)
                : (w = '');
        } else {
            w = this.state.code;
            alert(w);
        }

        let start = new Date(this.state.startDate);
        let end = new Date(this.state.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        //Date sorting
        for (let i = 0; i < this.state.salesTemp.length; i++) {
            if (
                Date.parse(this.state.salesTemp[i].saleDate) >= start &&
                Date.parse(this.state.salesTemp[i].saleDate) <= end &&
                this.state.salesTemp[i].advisorCode == w
            ) {
                this.state.sales.push(this.state.salesTemp[i]);
            }
        }

        for (let i = 0; i < this.state.salesTemp2.length; i++) {
            if (
                Date.parse(this.state.salesTemp2[i].saleDate) >= start &&
                Date.parse(this.state.salesTemp2[i].saleDate) <= end
            ) {
                if (this.state.salesTemp2[i].advisorCode == w) {
                    this.state.sales2.push(this.state.salesTemp2[i]);
                }
            }
        }

        this.componentDidMount();
    }

    render() {
        return (
            <Container>
                <Form>
                    <FormGroup controlId="saleT" bssize="large">
                        <FormLabel>From: </FormLabel>
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={(date) => {
                                this.setState({
                                    startDate: date,
                                });
                            }}
                        />
                        <br />
                        <FormLabel>To: </FormLabel>
                        <DatePicker
                            selected={this.state.endDate}
                            onChange={(date) => {
                                this.setState({
                                    endDate: date,
                                });
                            }}
                        />
                        <br></br>

                        <Fragment>{this.roleHandler()}</Fragment>

                        <h2>Domestic Sales Report</h2>
                    </FormGroup>
                </Form>
                <button onClick={this.toPDF}>Download PDF</button>
                <Table grid className="mt-4" id="export">
                    <thead>
                        <tr>
                            <th>Ticket Number</th>
                            <th>Fare(Local)</th>
                            <th>Fare(USD)</th>
                            <th>Cash</th>
                            <th>Credit Card(USD)</th>
                            <th>Credit Card(local)</th>
                            <th>Taxes</th>
                            <th>Total Paid(local)</th>
                            <th>Commission 9%</th>
                            <th>Commission 5%</th>
                            <th>Notes</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.sales.map(
                            ({
                                ticketNumber,
                                fare,
                                USDExchangeRate,
                                otherTax,
                                paymentMethod,
                                commissionRate,
                                notes,
                            }) => {
                                return (
                                    <tr>
                                        <td>{ticketNumber}</td>
                                        <td>
                                            {' '}
                                            {fare.toString().substring(0, 7)}
                                        </td>
                                        <td>
                                            {(fare * USDExchangeRate).toFixed(
                                                3
                                            )}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.cashCheck(
                                                paymentMethod,
                                                fare
                                            )}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.creditCheck(
                                                paymentMethod,
                                                fare
                                            )}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.creditCheck(
                                                paymentMethod,
                                                fare
                                            ) * USDExchangeRate}
                                        </td>
                                        <td> {otherTax}</td>
                                        <td>
                                            {' '}
                                            {(
                                                parseFloat(otherTax) +
                                                parseFloat(fare)
                                            ).toFixed(3)}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.commissionCheck9(
                                                commissionRate,
                                                fare
                                            )}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.commissionCheck5(
                                                commissionRate,
                                                fare
                                            )}
                                        </td>
                                        <td> {notes}</td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </Table>
                <Table grid className="mt-4" id="export2">
                    <thead>
                        <tr>
                            <th>Ticket Total</th>
                            <th>Total Fare(Local)</th>
                            <th>Total Fare(USD)</th>
                            <th>Total Cash</th>
                            <th>Total Credit Card(USD)</th>
                            <th>Total Credit Card(local)</th>
                            <th>Total Taxes</th>
                            <th>Total Paid(local)</th>
                            <th>Total Commission 9%</th>
                            <th>Total Commission 5%</th>
                            <th>Total Commission Amounts</th>
                            <th>Net Amounts For Debit</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>{this.state.sales.length}</td>
                            <td> {this.aggregate(1).toFixed(3)}</td>
                            <td> {this.aggregate(2).toFixed(3)}</td>
                            <td> {this.aggregate(3)}</td>
                            <td> {this.aggregate(4).toFixed(3)}</td>
                            <td> {this.aggregate(8)}</td>
                            <td> {this.aggregate(5)}</td>
                            <td>
                                {' '}
                                {(this.aggregate(5) + this.aggregate(1))
                                    .toString()
                                    .substring(0, 7)}
                            </td>
                            <td> {this.aggregate(6)}</td>
                            <td> {this.aggregate(7)}</td>
                            <td>
                                {(
                                    this.aggregate(6) * 0.09 +
                                    this.aggregate(7) * 0.05
                                ).toFixed(3)}
                            </td>
                            <td>
                                {' '}
                                {(
                                    this.aggregate(6) +
                                    this.aggregate(7) -
                                    (this.aggregate(6) * 0.09 +
                                        this.aggregate(7) * 0.05)
                                ).toFixed(3)}
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <h2>Interline Sales Report</h2>
                <button onClick={this.toPDFB}>Download PDF</button>
                <Table grid className="mt-4" id="exportB">
                    <thead>
                        <tr>
                            <th>Ticket Number</th>
                            <th>Fare(USD)</th>
                            <th>Exchange Rate</th>
                            <th>Fare(local)</th>
                            <th>Local Taxes</th>
                            <th>Other Taxes</th>
                            <th>Document Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.sales2.map(
                            ({
                                ticketNumber,
                                fare,
                                USDExchangeRate,
                                otherTax,
                                localTax,
                            }) => {
                                return (
                                    <tr>
                                        <td>{ticketNumber}</td>
                                        <td>
                                            {(fare * USDExchangeRate).toFixed(
                                                3
                                            )}
                                        </td>
                                        <td>{USDExchangeRate}</td>
                                        <td>{fare}</td>
                                        <td>{localTax}</td>
                                        <td>{otherTax}</td>
                                        <td>
                                            {parseFloat(localTax) +
                                                parseFloat(otherTax) +
                                                parseFloat(fare)}
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </Table>

                <Table grid className="mt-4" id="exportB3">
                    <thead>
                        <tr>
                            <th>Ticket Number</th>
                            <th>Cash</th>
                            <th>Credit Card Number</th>
                            <th>Credit Card(USD)</th>
                            <th>Credit Card(local)</th>
                            <th>Total Paid</th>
                            <th>Commission 15%</th>
                            <th>Commission 10%</th>
                            <th>Commission 9%</th>
                            <th>Non-Assessable Amounts</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.sales2.map(
                            ({
                                ticketNumber,
                                fare,
                                USDExchangeRate,
                                otherTax,
                                localTax,
                                paymentMethod,
                                commissionRate,
                                creditCardNum,
                                expDate,
                                securityCode,
                                saleDate,
                                notes,
                                saleType,
                            }) => {
                                return (
                                    <tr>
                                        <td>{ticketNumber}</td>
                                        <td>
                                            {' '}
                                            {this.cashCheck(
                                                paymentMethod,
                                                fare
                                            )}
                                        </td>
                                        <td>{creditCardNum}</td>
                                        <td>
                                            {' '}
                                            {this.creditCheck(
                                                paymentMethod,
                                                fare
                                            ) * USDExchangeRate}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.creditCheck(
                                                paymentMethod,
                                                fare
                                            )}
                                        </td>
                                        <td>
                                            {parseFloat(localTax) +
                                                parseFloat(otherTax) +
                                                parseFloat(fare)}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.commissionCheck15(
                                                commissionRate,
                                                fare
                                            )}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.commissionCheck10(
                                                commissionRate,
                                                fare
                                            )}
                                        </td>
                                        <td>
                                            {' '}
                                            {this.commissionCheck9(
                                                commissionRate,
                                                fare
                                            )}
                                        </td>
                                        <td>
                                            {' '}
                                            {parseFloat(localTax) +
                                                parseFloat(otherTax)}
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </Table>

                <Table grid className="mt-4" id="exportB2">
                    <thead>
                        <tr>
                            <th>Fare(USD)</th>
                            <th>Fare(local)</th>
                            <th>Local Taxes</th>
                            <th>Other Taxes</th>
                            <th>Document Total</th>

                            <th>Cash</th>
                            <th>Credit(USD)</th>
                            <th>Credit(local)</th>
                            <th>Total Paid</th>

                            <th>Commission 15%</th>
                            <th>Commission 10%</th>
                            <th>Commission 9%</th>

                            <th>Non-Assessable Amounts</th>
                            <th>Commission Amounts</th>
                            <th>Net Amount for Debit</th>
                            <th>Net Amount for Remittance</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td> {this.aggregate2(2)}</td>
                            <td> {this.aggregate2(1)}</td>
                            <td> {this.aggregate2(8)}</td>
                            <td> {this.aggregate2(5)}</td>
                            <td>
                                {' '}
                                {(
                                    parseFloat(this.aggregate2(1)) +
                                    parseFloat(this.aggregate2(5)) +
                                    parseFloat(this.aggregate2(8))
                                ).toFixed(3)}
                            </td>

                            <td> {this.aggregate2(3)}</td>
                            <td> {this.aggregate2(10)}</td>
                            <td> {this.aggregate2(4)}</td>

                            <td> {this.aggregate2(1)}</td>

                            <td> {this.aggregate2(9)}</td>
                            <td>{this.aggregate2(7)}</td>
                            <td>{this.aggregate2(6)}</td>

                            <td>
                                {(
                                    parseFloat(this.aggregate2(5)) +
                                    parseFloat(this.aggregate2(8))
                                )
                                    .toFixed(3)
                                    .toString()
                                    .substring(0, 7)}
                            </td>
                            <td>
                                {' '}
                                {(
                                    this.aggregate2(9) * 0.15 +
                                    this.aggregate2(7) * 0.1 +
                                    this.aggregate2(6) * 0.09
                                ).toFixed(3)}
                            </td>
                            <td>
                                {' '}
                                {(
                                    this.aggregate2(9) +
                                    this.aggregate2(7) +
                                    this.aggregate2(6) -
                                    this.aggregate2(9) * 0.15 +
                                    this.aggregate2(7) * 0.1 +
                                    this.aggregate2(6) * 0.09
                                ).toFixed(3)}
                            </td>
                            <td>
                                {' '}
                                {(
                                    parseFloat(this.aggregate2(9)) +
                                    parseFloat(this.aggregate2(7)) +
                                    parseFloat(this.aggregate2(6)) +
                                    parseFloat(this.aggregate2(8)) +
                                    parseFloat(this.aggregate2(5)) -
                                    parseFloat(this.aggregate2(9)) * 0.15 +
                                    parseFloat(this.aggregate2(7)) * 0.1 +
                                    parseFloat(this.aggregate2(6)) * 0.09
                                ).toFixed(3)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }
}
