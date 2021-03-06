import React, { Component, Fragment } from 'react';
import { Table } from 'reactstrap';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import {
    Form,
    FormGroup,
    Dropdown,
    FormControl,
    FormLabel,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import jsPDF from 'jspdf';

const _ = require('lodash'); //Library to Change Cases of things

let apiLinks = require('../api/config.json');

// Report Table
export default class ReportTableGRate extends Component {
    //Set the state to an empty list of objects that will be taken from the database
    state = {
        sales: [],
        saleT: 'saleType',
        dates: 'saleDate',
        dateinput: '',
        saleTypeValue: 'Choose Sale Type',
        summedValues: [],
        dict: {},
        startDate: new Date(),
        endDate: new Date(),
    };

    //runs when component mounts, use to gets the data from db
    componentDidMount() {
        axios
            .get(apiLinks.SALES)
            .then((res) => {
                const sales = res.data;
                this.setState({ sales });
                const tl = this.state.sales.filter(
                    (i) => i.saleType == 'Interline'
                );
                this.setState({ sales: tl });
            })
            .catch((err) => console.log('Error code: ', err));
    }

    // Create PDF file
    toPDF() {
        //exports table to pdf
        var pdf = new jsPDF('l', 'pt', 'A4');
        var source = document.getElementById('export');
        pdf.text('Global Interline Report By Rate', 50, 40);
        pdf.autoTable({ html: '#export', startY: 60 });
        pdf.autoTable({ html: '#exportB2' });

        pdf.save('GlobalRate.pdf');
    }

    onOpenClick(e, _id) {
        console.log(e, _id);
    }
    aggregate2(value) {
        let x = 0;
        if (value === 1) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                x += parseFloat(this.state.summedValues[i].saleNum);
            }
            return x;
        } else if (value === 2) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].total);
                x += y;
            }
            return x;
        } else if (value === 3) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].taxl);
                x += y;
            }
            return x;
        } else if (value === 4) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].taxo);
                x += y;
            }
            return x;
        } else if (value === 5) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].cash);
                x += y;
            }
            return x;
        } else if (value === 6) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].creditUSD);
                x += y;
            }
            return x;
        } else if (value === 7) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].credit);
                x += y;
            }
            return x;
        } else if (value === 8) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].c15);
                x += y;
            }
            return x;
        } else if (value === 9) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].c10);
                x += y;
            }
            return x;
        } else if (value === 10) {
            for (var i = 0; i < this.state.summedValues.length; i++) {
                let y = parseFloat(this.state.summedValues[i].c9);
                x += y;
            }
            return x;
        }
        return x;
    }
    aggregateSales() {
        let start = new Date(this.state.startDate);
        start.setHours(0, 0, 0, 0);
        let end = new Date(this.state.endDate);
        end.setHours(0, 0, 0, 0);

        //Date sorting
        let l = [];
        for (let i = 0; i < this.state.sales.length; i++) {
            if (
                Date.parse(this.state.sales[i].saleDate) >= start &&
                Date.parse(this.state.sales[i].saleDate) <= end
            ) {
                l.push(this.state.sales[i]);
            }
        }

        var x = 0,
            y = 0;
        for (x = 0; x < l.length; x++) {
            var k = 0;
            for (k = 0; k < this.state.summedValues.length; k++) {
                if (
                    this.state.summedValues[k].USDExchangeRate ==
                    l[x].USDExchangeRate
                )
                    break;
            }
            y = k;
            if (k == this.state.summedValues.length) {
                this.state.dict = {
                    USDExchangeRate: l[x].USDExchangeRate,
                    cash: 0,
                    credit: 0,
                    saleNum: 0,
                    total: 0,
                    fare2: 0,
                    taxl: 0,
                    taxo: 0,
                    creditUSD: 0,
                    c9: 0,
                    c10: 0,
                    c15: 0,
                    creditT: 0,
                };
                y = this.state.summedValues.push(this.state.dict) - 1;
            }
            if (this.state.sales[x].paymentMethod === 'CreditCard') {
                this.state.summedValues[y].credit += this.state.sales[x].fare;
                this.state.summedValues[y].creditUSD +=
                    this.state.sales[x].fare *
                    this.state.sales[x].USDExchangeRate;
                this.state.summedValues[y].creditT += 1;
            } else if (this.state.sales[x].paymentMethod === 'Cash') {
                this.state.summedValues[y].cash += this.state.sales[x].fare;
            }
            if (this.state.sales[x].commissionRate == '9') {
                this.state.summedValues[y].c9 += this.state.sales[x].fare;
            } else if (this.state.sales[x].commissionRate == '10') {
                this.state.summedValues[y].c10 += this.state.sales[x].fare;
            } else if (this.state.sales[x].commissionRate == '15') {
                this.state.summedValues[y].c15 += this.state.sales[x].fare;
            } else {
            }

            this.state.summedValues[y].taxo += parseFloat(
                this.state.sales[x].otherTax
            );
            this.state.summedValues[y].taxl += parseFloat(
                this.state.sales[x].localTax
            );

            this.state.summedValues[y].saleNum += 1;
            this.state.summedValues[y].total += this.state.sales[x].fare;
            this.state.summedValues[y].fare2 +=
                this.state.sales[x].fare * this.state.sales[x].USDExchangeRate;

            if (this.state.summedValues.c9 == undefined) {
                this.state.summedValues.c9 = 0;
            }
            if (this.state.summedValues.c10 == undefined) {
                this.state.summedValues.c10 = 0;
            }
            if (this.state.summedValues.c15 == undefined) {
                this.state.summedValues.c15 = 0;
            }
        }
    }

    render() {
        const row = (
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
                <tr key={advisorCode}>
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
                    <td></td>
                </tr>
            </Fragment>
        );

        return (
            <Container>
                <br></br>

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
                <br />
                <Form>
                    <FormGroup>
                        <Button
                            bssize="medium"
                            variant="outline-primary"
                            onClick={() => {
                                this.setState({
                                    sales: this.aggregateSales(),
                                });
                            }}
                        >
                            Generate Report
                        </Button>
                        {''}

                        <button onClick={this.toPDF}>Download PDF</button>
                    </FormGroup>
                </Form>
                <Table striped id="export" className="mt-4">
                    <thead>
                        <tr>
                            <th>Exchange Rate</th>
                            <th>Sales</th>
                            <th>Fare</th>
                            <th>Local Tax</th>
                            <th>Other Tax</th>
                            <th>Document Total</th>
                            <th>Cash</th>
                            <th>Credit#</th>
                            <th>Credit(USD)</th>
                            <th>Credit(local)</th>
                            <th>Total Paid</th>
                            <th>Commission 15%</th>
                            <th>Commission 10%</th>
                            <th>Commission 9%</th>
                            <th>Non-Assessable Amounts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.summedValues.map(
                            ({
                                USDExchangeRate,
                                saleNum,
                                credit,
                                cash,
                                total,
                                c9,
                                c10,
                                c15,
                                fare2,
                                taxl,
                                taxo,
                                creditUSD,
                                creditT,
                            }) => (
                                <tr key={USDExchangeRate}>
                                    <td>{USDExchangeRate}</td>
                                    <td>{saleNum}</td>
                                    <td>{total.toString().substring(0, 7)}</td>
                                    <td>{taxl}</td>
                                    <td>{taxo}</td>
                                    <td>
                                        {(
                                            parseFloat(taxo) +
                                            parseFloat(taxl) +
                                            parseFloat(total)
                                        ).toFixed(3)}
                                    </td>
                                    <td>{cash}</td>
                                    <td>{creditT}</td>
                                    <td>
                                        {creditUSD.toString().substring(0, 7)}
                                    </td>
                                    <td>{credit}</td>
                                    <td>
                                        {(
                                            parseFloat(taxo) +
                                            parseFloat(taxl) +
                                            parseFloat(total)
                                        ).toFixed(3)}
                                    </td>
                                    <td>{c15}</td>
                                    <td>{c10}</td>
                                    <td>{c9.toString().substring(0, 7)}</td>
                                    <td>{taxo + taxl}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </Table>

                <Table grid className="mt-4" id="exportB2">
                    <thead>
                        <tr>
                            <th>Sales</th>
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
                            <td> {this.aggregate2(1)}</td>
                            <td> {this.aggregate2(2).toFixed(3)}</td>
                            <td> {this.aggregate2(3)}</td>
                            <td> {this.aggregate2(4)}</td>
                            <td>
                                {' '}
                                {(
                                    this.aggregate2(2) +
                                    this.aggregate2(3) +
                                    this.aggregate2(4)
                                ).toFixed(3)}
                            </td>

                            <td> {this.aggregate2(5)}</td>
                            <td>
                                {' '}
                                {this.aggregate2(6).toString().substring(0, 7)}
                            </td>
                            <td> {this.aggregate2(7)}</td>
                            <td>
                                {' '}
                                {(
                                    this.aggregate2(2) +
                                    this.aggregate2(3) +
                                    this.aggregate2(4)
                                ).toFixed(3)}
                            </td>

                            <td> {this.aggregate2(8)}</td>
                            <td>{this.aggregate2(9)}</td>
                            <td>{this.aggregate2(10).toFixed(3)}</td>

                            <td>{this.aggregate2(3) + this.aggregate2(4)}</td>
                            <td>
                                {' '}
                                {(
                                    this.aggregate2(8) * 0.15 +
                                    this.aggregate2(9) * 0.1 +
                                    this.aggregate2(10) * 0.09
                                ).toFixed(3)}
                            </td>
                            <td>
                                {' '}
                                {(
                                    this.aggregate2(8) +
                                    this.aggregate2(9) +
                                    this.aggregate2(10) -
                                    (this.aggregate2(8) * 0.15 +
                                        this.aggregate2(9) * 0.1 +
                                        this.aggregate2(10) * 0.09)
                                ).toFixed(3)}
                            </td>
                            <td>
                                {' '}
                                {(
                                    this.aggregate2(8) +
                                    this.aggregate2(9) +
                                    this.aggregate2(10) +
                                    this.aggregate2(3) +
                                    this.aggregate2(4) -
                                    (this.aggregate2(8) * 0.15 +
                                        this.aggregate2(9) * 0.1 +
                                        this.aggregate2(10) * 0.09)
                                ).toFixed(3)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }
}
