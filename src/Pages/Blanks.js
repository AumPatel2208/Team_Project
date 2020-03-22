import React, {useState, Fragment} from 'react';
import { Container, Label } from 'reactstrap';
import ReportTurnoverT from "../Components/ReportTurnoverT";
import {Button, Dropdown, Form, FormControl, FormGroup, FormLabel,} from "react-bootstrap";

import axios from 'axios';
let apiLinks = require('../api/config.json');

export default function Blanks() {

    const [batchValues, setBatchValues] = useState("");
    const [date, setDate] = useState("");


    function handleSubmit(event) {
        event.preventDefault();
        console.log('hello');

        const tempBlanks = {
            batchValues,
            date
        };
        axios.post(apiLinks.BLANKS, tempBlanks).then(response => {
            console.log(response);
        });
    }
    return (
        <Container>
<h3>Add New Blanks</h3>
                <form onSubmit={handleSubmit}>
                    <FormGroup controlId="username" bssize="large">
                        <FormLabel>Batch</FormLabel>
                        <FormControl
                            autoFocus
                            type="batchValues"
                            value={batchValues}
                            onChange={e => setBatchValues(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup controlId="date" bssize="large">
                        <FormLabel>Receipt Date DD/MM/YYYY</FormLabel>
                        <FormControl
                            autoFocus
                            type="string"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </FormGroup>
                    <Button
                        onClick={e => {
                            handleSubmit(e)
                        }}
                    >
                        Add Blanks
                    </Button>
                </form>
            <Form>
                <h3>Blank Stock</h3>
                <ReportTurnoverT></ReportTurnoverT>
            </Form>
        </Container>
    );
}

