import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from '@mui/material';
import { Link } from "react-router-dom";
import api from "../api/AxiosApi";

export const TransactionsTable = () => {
    const defaultMaterialTheme = createTheme();

    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        api.get(`/transaction/all`,
            {
                params: {
                    operatorId: localStorage.getItem("operatorId") || 1,
                    isChecked: false
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
        {
            title: 'Validate', render: rowData => <Link to={`/transaction/validate/${rowData.id}`}>
                <button className="ui button blue">Validate</button>
            </Link>
        }
    ]
    return (<div>
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
    </div>)
} 