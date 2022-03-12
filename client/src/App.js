import React, {Component} from "react";
import Transaction from "./contracts/Transaction.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import {Grid, Container, Button, TextField, Typography, Box} from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 100
    },
    {
        field: 'address',
        headerName: 'Address',
        width: 500
    },
    {
        field: 'balance',
        headerName: 'Balance',
        width: 200
    }
];

class App extends Component {

    state = {
        loaded: false,
        ownerAccount: null,
        registerAccount: null,
        tempAmount: '',
        amount: 0,
        rows: []
    };

    componentDidMount = async () => {
        try {
            this.web3 = await getWeb3();
            this.accounts = await this.web3.eth.getAccounts();
            this.networkId = await this.web3.eth.getChainId();
            this.transactionInstance = new this.web3.eth.Contract(
                Transaction.abi,
                Transaction.networks[this.networkId]
                    && Transaction.networks[this.networkId].address,
            );
            window.web3 = this.web3;
            window.transactionInstance = this.transactionInstance;
            this.setState({
                ownerAccount: this.accounts[0],
                registerAccount: this.accounts[0],
                loaded: true,
            }, this.firstCallBack);
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    firstCallBack = async () => {
        console.log(this.state.ownerAccount);

        await this.fetchLogs();
        await this.fetchTotalBalance();
    };

    fetchLogs = async() =>{
        const {ownerAccount} = this.state;

        let listAddress = await this.transactionInstance.methods.getListOfUserAddress().call({
            from: ownerAccount
        });

        let listBalance = await this.transactionInstance.methods.getListOfUserBalance().call({
            from: ownerAccount
        });

        let tempRows = [];
        for(let _in=0; _in < listAddress.length; _in++){
            tempRows.push({
                id: _in,
                address: listAddress[_in],
                balance: listBalance[_in]
            })
        }

        this.setState({
            rows: tempRows
        });
    };

    fetchTotalBalance = async () => {
        let result = await this.transactionInstance.methods.getTotalBalance().call({
            from: this.state.ownerAccount
        });

        this.setState({
            amount: result
        })
    };

    _handleRegisterTextFieldChange = async(e) => {
        this.setState({
            registerAccount: e.target.value
        })
    };

    _handleAmountTextFieldChange = async(e) => {
        this.setState({
            tempAmount: e.target.value
        })
    };


    handleRegister = async (e) => {
        console.log("-=-=-= Register =-=-=-");
        const {registerAccount, ownerAccount} = this.state;
        await this.transactionInstance.methods.register(registerAccount).send({
            from: registerAccount
        });
        await this.fetchLogs();

    };

    handleDeposit =async () => {
        console.log("-=-=-= Deposit =-=-=-");
        const {registerAccount, tempAmount} = this.state;
        if(tempAmount){
            await this.transactionInstance.methods.deposit(tempAmount).send({
               from: registerAccount
            });

            await this.fetchLogs();
            await this.fetchTotalBalance();

            this.setState({
               tempAmount: ''
            });
        }
    };

    handleWithdraw =async () => {
        console.log("-=-=-= Withdraw =-=-=-");
        const {registerAccount, tempAmount} = this.state;
        if(tempAmount){
            await this.transactionInstance.methods.withdraw(tempAmount).send({
                from: registerAccount
            });

            await this.fetchLogs();
            await this.fetchTotalBalance();

            this.setState({
                tempAmount: ''
            });
        }
    }

    render() {
        if (!this.state.loaded) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <Container className="App">
                <br/>
                <Box style={{fontSize:"40px", fontWeight:"fontWeightBold"}}>Simple Transaction</Box>
                <br/>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <div style={{ display: "flex",justifyContent:"flex-end"}}>
                            <TextField id="standard-basic" style={{width: "60%"}}
                            value={this.state.registerAccount}
                            onChange={this._handleRegisterTextFieldChange}
                            label="Insert an address 0x.."/>
                        </div>
                    </Grid>
                    <Grid item xs={4} id="LeftAlignCenter">
                        <Button variant={"contained"}
                        onClick={this.handleRegister}>Register</Button>
                    </Grid>

                    <Grid container xs={7} style={{ display: "flex",justifyContent:"flex-end", paddingRight:"10px"}}>
                        <TextField style={{width: "52%"}} id="standard-basic"  label="Insert amount of TK" type="number"
                        InputProps={{ inputProps:{ min:0, max:1000}}}
                        value={this.state.tempAmount}
                        onChange={this._handleAmountTextFieldChange}/>
                    </Grid>
                    <Grid container xs={1} style={{paddingRight:"10px"}}>
                        <Button variant={"contained"} style={{width: "100%"}}
                        onClick={this.handleDeposit}>Deposit</Button>
                    </Grid>
                    <Grid container xs={1}>
                        <Button variant={"contained"} style={{width: "100%"}}
                        onClick={this.handleWithdraw}>Withdraw</Button>
                    </Grid>
                </Grid>
                <br/>
                <br/>
                <Grid container spacing={2} id="MiddleAlignCenter">
                    <Grid container xs={3} id="LeftAlignCenter">
                        <Box id="LeftAlignCenter">Transaction</Box>
                    </Grid>
                    <Grid container xs={3} id="RightAlignCenter">
                        <Box>Total balance: {this.state.amount} TK</Box>
                    </Grid>
                </Grid>
                <br/>
                <br/>
                <Grid container spacing={1}  id="MiddleAlignCenter">
                    <Grid container xs={8} style={{height: 400}}>
                        <DataGrid
                            rows={this.state.rows}
                            columns={columns}
                            pageSize={5}
                            disableSelectionOnClick
                        />
                    </Grid>
                </Grid>
            </Container>
        );
    }


}

export default App;
