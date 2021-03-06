import React from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import './Styles/WrapTD.css';

import Nav from './Components/Navbar';
import Login from './Pages/Login';
import Home from './Pages/Home';
import NotFound from './Pages/404';
import Restricted from './Pages/Restricted';
import RegisterStaff from './Pages/RegisterStaff';

import Reports from './Pages/Reports';
import Blanks from './Pages/Blanks';
import Customers from './Pages/Customers';
import { CustomerUpdate } from './Components/CustomerUpdate';
import BackupRestore from './Pages/BackupRestore';
import ExRates from './Pages/ExRates';
import Sale from './Pages/Sale';
import Assignment from './Components/Assignment';
import TableOfAdvisors from './Components/TableOfAdvisors';
import TableOfSales from './Components/TableOfSales';
import AdvisorBlanks from './Components/AdvisorBlanks';
import { SaleForm } from './Components/SaleForm';
import { ReAssignBlanks } from './Components/ReAssignBlanks';

import ReportTableI from './Components/ReportTableI';

import SaleEditor from './Components/SaleEditor';
import LatePayments from './Pages/LatePayments';
import Notifications from './Components/Notifications';
import ReportTurnoverT from './Components/ReportTurnoverT';

const apiLinks = require('./api/config.json');

// Main Component that is loaded before anything.
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: '',
            staff: undefined,
            isAuthenticated: false,
            sales: [],
        };
    }

    // Load the user in when the component is mounted.
    async componentDidMount() {
        //Loading User
        await axios
            .get('api/secure/staff')
            .then((res) => {
                this.setState({ ...this.state, userID: res.data });
            })
            .catch((err) => {
                console.log('Not Logged In! Error: ', err.request);
            });
        if (this.state.userID !== '')
            await axios
                .get('api/staffMembers/' + this.state.userID)
                .then((res, err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        this.setState({
                            ...this.state,
                            staff: res.data,
                            isAuthenticated: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log('Error Code: ', err);
                });
        if (this.state.staff) {
            if (this.state.staff.staffType === 'OfficeManager') {
                await axios.get('/api/sales').then(async (res) => {
                    this.setState({ sales: await res.data });
                });
            }
        }
    }

    // on logout, do a POST which will delete the cookie and refresh the page.
    async logout() {
        await axios
            .post('api/secure/logout')
            .then((res) => {
                alert(res.data.msg);
            })
            .catch((err) => console.log('Logout Failed, error code: ', err));
        this.setState({
            ...this.state,
            staff: undefined,
            isAuthenticated: false,
        });
        window.location.replace('./');
    }

    // Render the components
    // Renders the NavBar
    // Uses a Switch which changes what routes are rendered based on the URL
    render() {
        return (
            <div>
                <Nav
                    isAuthenticated={this.state.isAuthenticated}
                    staff={this.state.staff}
                ></Nav>

                <Switch>
                    <Route
                        exact={true}
                        path="/"
                        render={() => (
                            <div className="App">
                                {this.state.isAuthenticated &&
                                this.state.staff.staffType ===
                                    'OfficeManager' ? (
                                    <Notifications sales={this.state.sales} />
                                ) : null}
                                <Home
                                    isAuthenticated={this.state.isAuthenticated}
                                    staff={this.state.staff}
                                />
                            </div>
                        )}
                    />
                    <Route
                        exact={true}
                        path="/customers"
                        render={() => (
                            <div className="App">
                                <Customers staff={this.state.staff} />
                            </div>
                        )}
                    ></Route>
                    <Route
                        exact={true}
                        path="/sales"
                        render={() => (
                            <div className="App">
                                <TableOfSales staff={this.state.staff} />
                            </div>
                        )}
                    ></Route>
                    <Route
                        exact={true}
                        path="/sales/latePayments"
                        render={() => (
                            <div className="App">
                                <TableOfSales
                                    latePayments={true}
                                    staff={this.state.staff}
                                />
                            </div>
                        )}
                    ></Route>
                    <Route
                        exact={true}
                        path="/sale_edit/:id"
                        render={(props) => (
                            <div className="App">
                                <SaleEditor {...props}></SaleEditor>
                            </div>
                        )}
                    ></Route>
                    <Route
                        path="/customers/:id"
                        render={(props) => (
                            <CustomerUpdate
                                {...props}
                                staff={this.state.staff}
                                isAuthenticated={this.state.isAuthenticated}
                                isNew={false}
                            />
                        )}
                    />
                    <Route
                        path="/customer/create"
                        render={(props) => (
                            <CustomerUpdate
                                {...props}
                                staff={this.state.staff}
                                isAuthenticated={this.state.isAuthenticated}
                                isNew={true}
                            />
                        )}
                    />
                    <Route
                        exact={true}
                        path="/advisors"
                        render={() => (
                            <div className="App">
                                {this.state.isAuthenticated &&
                                this.state.staff.staffType ===
                                    'OfficeManager' ? (
                                    <TableOfAdvisors
                                        staff={this.state.staff}
                                    ></TableOfAdvisors>
                                ) : (
                                    <Restricted></Restricted>
                                )}
                            </div>
                        )}
                    ></Route>
                    <Route
                        exact={true}
                        path="/login"
                        render={() => (
                            <div className="App">
                                <Login
                                    isAuthenticated={this.state.isAuthenticated}
                                />
                            </div>
                        )}
                    />
                    <Route
                        exact={true}
                        path="/logout"
                        render={() => (
                            <div className="App">
                                {this.state.isAuthenticated
                                    ? this.logout()
                                    : null}
                            </div>
                        )}
                    />
                    <Route
                        exact={true}
                        path="/registerStaff"
                        render={() => (
                            <div className="App">
                                <RegisterStaff
                                    staff={this.state.staff}
                                    isNew={true}
                                />
                            </div>
                        )}
                    />
                    <Route
                        path="/staff/:id"
                        render={(props) => (
                            <RegisterStaff
                                {...props}
                                isNew={false}
                            ></RegisterStaff>
                        )}
                    />
                    <Route
                        exact={true}
                        path="/reports"
                        render={() => (
                            <div className="App">
                                {this.state.isAuthenticated &&
                                this.state.staff.staffType ===
                                    'OfficeManager' ? (
                                    <Reports staff={this.state.staff} />
                                ) : this.state.isAuthenticated &&
                                  this.state.staff.staffType ===
                                      'SystemAdministrator' ? (
                                    <ReportTurnoverT></ReportTurnoverT>
                                ) : (
                                    <ReportTableI
                                        staff={this.state.staff}
                                    ></ReportTableI>
                                )}
                            </div>
                        )}
                    />
                    <Route
                        exact={true}
                        path="/blanks"
                        render={() => (
                            <div className="App">
                                <Blanks staff={this.state.staff} />
                            </div>
                        )}
                    />
                    <Route
                        path="/blanks/:id"
                        render={(props) => <Assignment {...props} />}
                    />
                    <Route
                        path="/blankAssigned/:id"
                        render={(props) => <ReAssignBlanks {...props} />}
                    />
                    <Route
                        exact={true}
                        path="/backup-restore"
                        render={() => (
                            <div className="App">
                                <BackupRestore staff={this.state.staff} />
                            </div>
                        )}
                    />
                    <Route
                        exact={true}
                        path="/exchange-rates"
                        render={() => (
                            <div className="App">
                                <ExRates></ExRates>
                            </div>
                        )}
                    />
                    <Route
                        exact={true}
                        path="/sale"
                        render={() => (
                            <div className="App">
                                <AdvisorBlanks staff={this.state.staff} />
                            </div>
                        )}
                    />
                    <Route
                        path="/sales/:id"
                        render={(props) => (
                            <div className="App">
                                <SaleForm {...props} staff={this.state.staff} />
                            </div>
                        )}
                    />
                    <Route
                        exact={true}
                        path="/latePayments"
                        render={() => (
                            <div className="App">
                                <LatePayments />
                            </div>
                        )}
                    />
                    <Route
                        render={() => (
                            <div className="App">
                                <NotFound />
                            </div>
                        )}
                    />
                </Switch>
            </div>
        );
    }
}

export default App;
