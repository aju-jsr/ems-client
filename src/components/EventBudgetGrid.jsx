import * as React from "react";
import { Box, Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useEventBudgetProposalsList from "../hooks/useEventBudgetProposalsList";

export default function EventBudgetGrid(
  proposalId,
//   onRowSelected,
)  {

  const {
    rows,
    loading,
  } = useEventBudgetProposalsList(proposalId.proposalId);

  const handleRowSelected = (row) => {

        // setSelectedRow(row);

        alert(
            "Selected Request No : " +
            row.request_no
        );

    };

  const columns = [
    {
    
        field: "request_no",
        headerName: "Request No.",
        width: 140,
        onselect: {handleRowSelected}
       
        // renderCell: (params) => (
        // <Link
        //     component="button"
        //     underline="hover"
        //     // onClick={() => onRowSelected(params.row)}
        //     sx={{
        //     fontSize: "0.80rem",
        //     fontWeight: "bold",
        //     cursor: "pointer",
        //     }}
        // >
        //     {params.value}
        // </Link>
        // ),
    },
    {
      field: "req_emp_name",
      headerName: "Employee Name",
      width: 180,
    },
    {
      field: "department_name",
      headerName: "Department",
      width: 250,
    },
    {
      field: "requested_date",
      headerName: "Request Date",
      width: 150,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-GB")
          : "",
    },
    {
      field: "budget_amount",
      headerName: "Budget Amount",
      width: 150,
      type: "number",
      valueFormatter: (value) =>
        value?.toLocaleString("en-IN"),
    },
    {
      field: "adv_payment_due_date",
      headerName: "Payment Due Date",
      width: 170,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-GB")
          : "",
    },
    {
      field: "status_name",
      headerName: "Status",
      width: 100,
    },
  ];

  return (
    <Box sx={{ height: 500, width: 1000 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        // disableRowSelectionOnClick
        getRowHeight={() => "auto"}
        onRowSelectionModelChange={(ids) => {
            console.log(ids);
        }}

        // sx={{
        //     border: 1,
        //     borderColor: "divider",

        //     "& .MuiDataGrid-columnHeaders": {
        //         backgroundColor: "#FFC107",
        //         fontWeight: "bold",
        //         fontSize: "0.8rem",
        //         borderBottom: "2px solid #BDBDBD",
        //     },

        //     "& .MuiDataGrid-columnHeaderTitle": {
        //         fontWeight: 700,
        //         fontSize: "0.8rem",
        //     },

        //     "& .MuiDataGrid-cell": {
        //         fontSize: "0.8rem",
        //         py: 1,
        //         alignItems: "center",
        //     },

        //     "& .MuiDataGrid-row:nth-of-type(even)": {
        //         backgroundColor: "#FAFAFA",
        //     },

        //     "& .MuiDataGrid-row:hover": {
        //         backgroundColor: "#FFF8E1",
        //     },
        // }}

        // For Yellow header
        sx={{
    // Header
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#FFD54F", // Yellow
      color: "#000",
      fontWeight: "bold",
      fontSize: "0.80rem",
    },

    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#FFD54F",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: "bold",
      fontSize: "0.80rem",
    },

    // Rows
    "& .MuiDataGrid-row": {
      fontSize: "0.80rem",
    },

    // Cells
    "& .MuiDataGrid-cell": {
      whiteSpace: "normal !important",
      wordBreak: "break-word",
      lineHeight: "1.5 !important",
      display: "flex",
      alignItems: "center",
      py: 1,
      fontSize: "0.80rem",
    },

    // Footer
    "& .MuiDataGrid-footerContainer": {
      fontSize: "0.80rem",
    },
  }}

      />
    </Box>
  );
}


// import * as React from "react";
// import { Box } from "@mui/material";
// import { DataGrid, Toolbar } from "@mui/x-data-grid";

// export default function EventBudgetGrid() {

//     const columns = [
//         { field: "id", headerName: "Request No.", width: 120 },
//         { field: "name", headerName: "Emp Name", width: 120 },
//         { field: "dept", headerName: "Department", width: 200 },
//         { field: "ReqDate", headerName: "Request Date", width: 120 },
//         { field: "Amt", headerName: "Budget Amt", width: 120 },
//         { field: "dueDate", headerName: "Payment Due Date", width: 150 },
//         { field: "status", headerName: "Status", width: 100 },
//     ];

//     const rows = [
//         { id: 1, name: "John", dept: "Department of Management", ReqDate: "25-07-2026", Amt: 50000, dueDate: "25-07-2026", status:"Pending RM Review" },
//         { id: 2, name: "David", dept: "Department of Commerce", ReqDate: "26-07-2026", Amt: 70000, dueDate: "26-07-2026", status:"Pending RM Review"},
//         { id: 3, name: "Peter", dept: "Department of Law", ReqDate: "27-07-2026", Amt: 60000, dueDate: "27-07-2026", status:"Pending RM Review" },
//         { id: 4, name: "James", dept: "Department of English", ReqDate: "28-07-2026", Amt: 45000, dueDate: "28-07-2026", status:"Pending RM Review" },
//         { id: 5, name: "Robert", dept: "Department of Law", ReqDate: "29-07-2026", Amt: 80000, dueDate: "29-07-2026", status:"Pending RM Review" },
//     ];

//     return (
//         <Box sx={{ height: 500, width: 1000 }}>
//             <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 getRowHeight={() => "auto"}
//                 sx={{
//                     "& .MuiDataGrid-cell": {
//                     whiteSpace: "normal !important",
//                     wordWrap: "break-word",
//                     lineHeight: "1.5 !important",
//                     display: "flex",
//                     alignItems: "center",
//                     py: 1,
//                     },
//                 }}
//                 />
//         </Box>
//     );
// }