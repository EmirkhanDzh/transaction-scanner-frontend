import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableCell, TableRow, TableBody, Table } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import { Link } from "react-router-dom";
import api from "../api/AxiosApi";

const ViewResult = (props) => {
   const { id } = useParams()
   const [transaction, setTransaction] = useState(null)

   useEffect(() => {
      api.get(`/transaction/${id}`).then((response) => {
         console.log(response.data)
         setTransaction(response.data)
      })
   }, [])

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



   const isClear = transaction.operatorResult.isClear

   return (
      <div className="main">
         <div>
            <h3>Transaction Validation</h3>
            <Link to={`/transaction/result/view/all`}>
               <button className="ui right floated button black ">To Checked List</button>
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
         <h4 className={`ui ${isClear ? 'green' : 'red'} header`}>Validation result: {isClear ? 'clear' : 'sanctioned'}</h4>

         <TextField
            className="ValidationResultTextField bottomMargin"
            id="outlined-multiline-static"
            label="Comment:"
            multiline
            rows={4}
            defaultValue={transaction.operatorResult.comment}
            inputProps={
               { readOnly: true, }
            }
         />
      </div>
   );
}

export default ViewResult;