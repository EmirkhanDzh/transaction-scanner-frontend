import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TableCell, TableRow, TableBody, Table } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom";
import api from "../api/AxiosApi";

const ValidateTransaction = (props) => {
    const navigate = useNavigate();
    const valueRef = useRef("");
    const { id } = useParams()
    const [transaction, setTransaction] = useState(null)

    useEffect(() => {
        api.get(`/transaction/${id}`).then((response) => {
            console.log(response.data)
            setTransaction(response.data)
        })
    }, [])

    const saveOperatorResult = (isClear) => {
        console.log(valueRef.current.value);

        // const config = { headers: { 'Content-Type': 'application/json' } };

        const data = {
            operatorResultId: transaction.operatorResult.id,
            isClear: isClear,
            comment: valueRef.current.value,
        }

        api.put("/transaction/complete-operator-result", data).then((response) => {
            navigate("/operator")
        }).catch((err) => {
            console.log(err);
            alert("Check if json is valid!");
            navigate("/operator")
        })
    }

    if (!transaction) {
        return (<p>processing...</p>)
    }

    const sanction = transaction?.operatorResult?.rulesEngineResultDto?.sanctionDto


    let clientSanction
    let bankSanction
    let paySystemSanction
    let countrySanction

    if (sanction) {
        clientSanction = sanction.type === "ClientSanctionList" ? `${sanction.value + ": " + sanction.description}` : null
        bankSanction = sanction.type === "BankSanctionList" ? `${sanction.value + ": " + sanction.description}` : null
        paySystemSanction = sanction.type === "paySystemSanctionList" ? `${sanction.value + ": " + sanction.description}` : null
        countrySanction = sanction.type === "countrySanctionList" ? `${sanction.value + ": " + sanction.description}` : null
    }


    console.log(clientSanction)

    return transaction ? (
        <div className="main">
            <div>
                <h3>Transaction Validation</h3>
                <Link to={`/operator`}>
                    <button className="ui right floated button black ">Home</button>
                </Link>
            </div>

            <h4>Rules result:</h4>
            <Table className="TransactionDetailTable">
                <TableBody>
                    <TableRow>
                        <TableCell className="FieldHeader"><h5>Clients</h5></TableCell>
                        <TableCell className="FieldValue">{`${transaction.clientFrom} → ${transaction.clientTo}`}</TableCell>
                        <TableCell className="FieldResultIcon">{!clientSanction ? <CheckIcon /> : <CloseIcon sx={{ color: red[500] }} />}</TableCell>
                        <TableCell className="FieldResultDescription">{clientSanction || ""}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="FieldHeader"><h5>Banks</h5></TableCell>
                        <TableCell className="FieldValue">{`${transaction.bankFrom} → ${transaction.bankTo}`}</TableCell>
                        <TableCell className="FieldResultIcon">{!bankSanction ? <CheckIcon /> : <CloseIcon sx={{ color: red[500] }} />}</TableCell>
                        <TableCell className="FieldResultDescription">{bankSanction || ""}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="FieldHeader"><h5>Paysystems</h5></TableCell>
                        <TableCell className="FieldValue">{`${transaction.paySystemFrom} → ${transaction.paySystemTo}`}</TableCell>
                        <TableCell className="FieldResultIcon">{!paySystemSanction ? <CheckIcon /> : <CloseIcon sx={{ color: red[500] }} />}</TableCell>
                        <TableCell className="FieldResultDescription">{paySystemSanction || ""}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="FieldHeader"><h5>Countries</h5></TableCell>
                        <TableCell className="FieldValue">{`${transaction.countryFrom} → ${transaction.countryTo}`}</TableCell>
                        <TableCell className="FieldResultIcon">{!countrySanction ? <CheckIcon /> : <CloseIcon sx={{ color: red[500] }} />}</TableCell>
                        <TableCell className="FieldResultDescription">{countrySanction || ""}</TableCell>
                    </TableRow>

                </TableBody>
            </Table>
            <h4>Validation result:</h4>

            <TextField
                className="ValidationResultTextField bottomMargin"
                id="outlined-multiline-static"
                label="Input there a comment"
                multiline
                rows={4}
                inputRef={valueRef}
                defaultValue=""
            />

            <div style={{ justifyContent: "space-between", display: "flex", paddingBottom: "0.5rem" }}>
                <button className="ui   button positive" onClick={() => saveOperatorResult(true)}>Save As Clear</button>
                <button className="ui button negative" onClick={() => saveOperatorResult(false)}>Save As Sactional</button>
            </div>

        </div>
    ) : (<p>processing...</p>);
}

export default ValidateTransaction;