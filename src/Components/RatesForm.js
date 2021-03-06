import { Button, Container, Table } from 'react-bootstrap';
import React, { Component, Fragment } from 'react';
import { Form, FormControl, FormLabel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import axios from 'axios';

let apiLinks = require('../api/config.json');

// component for the Rates Form
export default class RatesForm extends Component {
    state = {
        rates: [],
        dateE: new Date(),
        eRate: '',
        code: '',
    };

    handleSubmit(event) {
        //adds a new exchange rate into the system

        const newRate = {
            currencyCode: this.state.code,
            date: Date.now(),
            toUSDRate: this.state.eRate,
        };

        event.preventDefault();
        console.log('hello');

        axios
            .post(apiLinks.EXCHANGERATES, newRate)
            .then((response) => {
                console.log(response);
            })
            .catch((err) => console.log('Error code: ', err));
    }

    // Render it
    render() {
        const row = (currencyCode, date, toUSDRate) => (
            <Fragment>
                <tr>
                    <td>{currencyCode}</td>
                    <td>{date}</td>
                    <td>{toUSDRate}</td>
                    <td>
                        <Button
                            className="open-btn"
                            color="primary"
                            size="sm"
                            //  onClick={this.onOpenClick.bind(this)}
                        >
                            open
                        </Button>
                    </td>
                </tr>
            </Fragment>
        );

        return (
            <Container>
                <br></br>
                <h2>
                    <strong>Create Exchange Rate</strong>
                </h2>
                <Form>
                    <FormLabel>Enter Rate</FormLabel>
                    <FormControl
                        autoFocus
                        type="string"
                        value={this.state.eRate}
                        onChange={(e) => {
                            this.setState({
                                eRate: e.target.value,
                            });
                        }}
                    />
                    <FormLabel>Enter Currency</FormLabel>
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
                    <br></br>
                    <Button
                        bssize="medium"
                        variant="outline-info"
                        onClick={(e) => {
                            this.handleSubmit(e);
                        }}
                        block
                    >
                        Save Rate
                    </Button>
                    <br></br>
                    <br></br>
                    <br></br>
                    <h2>
                        <strong>Search Exchange Rates</strong>
                    </h2>
                    <br></br>
                    <FormLabel>Search For Rates By Date </FormLabel>
                    <DatePicker
                        selected={this.state.dateE}
                        onChange={(date) => {
                            this.setState({
                                dateE: date,
                            });
                        }}
                    ></DatePicker>{' '}
                    <Button
                        bssize="medium"
                        variant="outline-primary"
                        onClick={() => {
                            let start = this.state.dateE;
                            axios
                                .get(apiLinks.EXCHANGERATES + '/byDate', {
                                    params: { start },
                                })
                                .then((res) => {
                                    const rates = res.data;
                                    this.setState({ rates });
                                    console.log(rates);
                                });
                        }}
                    >
                        Search
                    </Button>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                <th>Currency</th>
                                <th>Date</th>
                                <th>To USD Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rates.map(
                                ({ currencyCode, date, toUSDRate }) => (
                                    <Fragment>
                                        {row(currencyCode, date, toUSDRate)}
                                    </Fragment>
                                )
                            )}
                        </tbody>
                    </Table>
                </Form>
            </Container>
        );
    }
}
