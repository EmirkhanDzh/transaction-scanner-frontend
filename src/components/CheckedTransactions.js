import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from '@mui/material';
import { Link } from "react-router-dom";
import api from "../api/AxiosApi";


const CheckedTransactions = () => {
    const defaultMaterialTheme = createTheme();

    const [transactions, setTransactions] = useState([])
    useEffect(() => {
        api.get(`/transaction/all`,
            {
                params: {
                    operatorId: localStorage.getItem("operatorId") || 1,
                    isChecked: true
                }
            }).then((response) => {
                console.log(response.data);
                setTransactions(response.data)
            })
    }, [])

    const columns = [
        { title: 'Sender client', field: "clientFrom" },
        { title: 'Recipient client', field: "clientTo" },
        { title: 'Amount', field: "amount" },
        { title: 'Sender Bank', field: "bankFrom" },
        { title: 'Recipient Bank', field: "bankTo" },
        { title: 'Sender Paysystem', field: "paySystemFrom" },
        { title: 'Recipient Paysystem', field: "paySystemTo" },
        { title: 'Is Clear', render: rowData => <button className={`ui button ${rowData.operatorResult.isClear ? 'green' : 'red'}`}>{rowData.operatorResult.isClear ? 'Yes' : 'No'}</button>, field: "operatorResult.isClearByOperator" },
        {
            title: 'View', render: rowData => <Link to={`/transaction/result/view/${rowData.id}`}>
                <button className="ui button blue">View</button>
            </Link>
        }
    ]

    return (
        <div className="main">
            <ThemeProvider theme={defaultMaterialTheme}>
                <MaterialTable
                    title="Suspicious Transactions"
                    data={transactions}
                    columns={columns}
                    options={{
                        filtering: true,
                        pageing: true,
                        pageSize: 6,
                        pageSizeOptions: [6, 12, 24, 48],
                    }}
                />
            </ThemeProvider>
        </div>
    );
};

export default CheckedTransactions