import React, { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom";
import api from "../api/AxiosApi";

const UploadTransactions = (props) => {
    const navigate = useNavigate();
    const valueRef = useRef("");

    const saveTransaction = () => {
        console.log(valueRef.current.value);

        const config = { headers: {'Content-Type': 'application/json'} };

        api.post("/transaction/save", valueRef.current.value, config).then((response)=>{
            alert("Transactions were send to scanner engine!");
        }).catch((err) => {
            console.log(err);
            alert("Check if json is valid!");
        })
    }

    return (
        <div className="main">
            <div>
                <h3>Upload Transactions To System</h3>
                <Link to={`/operator`}>
                    <button className="ui right floated button black bottomMargin">Home</button>
                </Link>
            </div>

            <TextField
                className="ValidationResultTextField bottomMargin"
                id="outlined-multiline-static"
                label="Input there a json array of transactions"
                multiline
                rows={16}
                inputRef={valueRef}
                defaultValue=""
            />

            <div>
                <button className="ui right floated button blue" onClick={saveTransaction}>Save Transactions</button>
            </div>
        </div>
    );
}

export default UploadTransactions;