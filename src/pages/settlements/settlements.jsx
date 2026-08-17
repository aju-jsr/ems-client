import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    TextField,
    Select,
    Button,
    Box,
    Alert,
    Typography,
    Link,
    Autocomplete
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import {
    LocalizationProvider
} from "@mui/x-date-pickers";

import {
    AdapterDayjs
} from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
    DatePicker
} from "@mui/x-date-pickers";

import React, { useEffect, useState } from 'react';
import { useRef } from "react";

// Style import
import SectionCard from "../../components/SectionCard";
import '../../styles/event.css';
import { formControl3rows, formControl2rows, formControl4rows } from "../../styles/commonStyles.js";

// File upload Attachment import
import FileUpload from "../../components/FileUpload";
import AttachmentList from "../../components/AttachmentList";

// Menu Layout import
// import MainLayout from '../../components/MainLayout.jsx';

// Header Component
import { useHeader } from "../../components/HeaderContext.jsx";

// Hooks import
import useGetSettlementForRequester from "../../hooks/settlements/useGetSettlementForRequester.js";
import useSettlementType from "../../hooks/settlements/useSettlementType.js"
import useSettlement from "../../hooks/settlements/useSettlement.js";
import useUnits from "../../hooks/useUnits.js";
import useSchools from "../../hooks/useSchool";
import useDept from "../../hooks/useDept";
import useAccTypes from "../../hooks/useAccType";
import useSettlementPOST from "../../hooks/settlements/useSettlementPOST.js"
// import useSettlement from "../../hooks/settlements/useSettlement.js"
import { getSettlement } from "../../services/settlements/getSettlementById_Service.js"
import { getProposaReqNo } from "../../services/proposals_req_no_Service.js";
import { getCheckSettlement } from "../../services/settlements/checksettlementService.js"


export default function Settlement() {
    // Set Form Title
    const { setHeaderTitle } = useHeader();
    setHeaderTitle("Settlement");

    const [newrows, setNewRows] = useState([]);

    // Loged in user details
    const empId = JSON.parse(localStorage.getItem("user"))?.empId;

    const currentDate = new Date();

    // const TodayformattedDate = String(currentDate.getDate()).padStart(2, "0") + "-" +
    //                     String(currentDate.getMonth() + 1).padStart(2, "0") + "-" +
    //                   currentDate.getFullYear();
    const TodayformattedDate = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

    const getFinancialYear = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // January = 1

        if (month >= 4) {
            // April to December
            return `${year}-${String(year + 1).slice(-2)}`;
        } else {
            // January to March
            return `${year - 1}-${String(year).slice(-2)}`;
        }
    };

    // Submit form
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [settlementResponse, setSettlementResponse] = useState(null);
    // Set form data
    const [formData, setFormData] = useState({
        settlement_no: "ESN-",
        sub_settlement_no: "",
        request_date: TodayformattedDate,
        settlement_type: "",
        status: "Draft",
        event_proposal_no: "",
        unit: "",
        event_name: "",
        event_start_date: null,
        event_end_date: null,
        school_id: "",
        department_id: "",
        name_of_head: "",
        financial_year: getFinancialYear(),
        req_emp_id: JSON.parse(localStorage.getItem("user"))?.empId,
        req_emp_name: JSON.parse(localStorage.getItem("user"))?.name,
        manager_id: "",
        approved_budget: "",
        adv_amount: "",
        actual_expense_total: "",
        balance_excess: "",
        remarks: "",
        acc_holder_name: "",
        acc_number: "",
        ifsc_code: "",
        bank_name: "",
        branch: "",
        acc_type_id: "",
        created_at: null,
        approved_by: "",
        approved_date: null,
        approved_amount: "",
        approved_remarks: "",
        fin_approved_by: "",
        fin_approved_date: "",
        fin_approved_amount: "",
        fin_remarks: "",
        status_name: "Draft",
        department_name: "",

    });

    // get the requested Settlements list from DB using Hook
    const {
        rows,
        loading,
    } = useGetSettlementForRequester(empId);

    // Calling Settlement by id
    // const [settlementid, setSettlementid] = useState("");
    // const {
    //     SettlementRows,
    //     Settlementloading,
    // } = useSettlement(settlementid);


    // get the Settlements Type list from DB using Hook
    const { settlementtype } = useSettlementType();

    // get the Units from DB using Hook
    const { units } = useUnits();

    // get the schools from DB using Hook
    const { schools } = useSchools();

    // get the Departments from DB using Hook
    const {
        departments,
        loading: deptLoading,
        error: deptError,
    } = useDept(formData.school_id);

    // get the Account Type from DB using Hook
    const { acctypes } = useAccTypes();

    const onRowSelected = async (Selrow) => {
        // setSettlementid(Selrow.id);
        setDisableSubmit(true);
        const response = await getSettlement(Selrow.id);

        setExpenseRows(response.actualExpenses);
        setFileList(response.supportingDocuments);

        response.settlement.map((row) => {
            if (row.id === Selrow.id) {
                setFormData((prev) => ({
                    ...prev,
                    settlement_no: row.settlement_no,
                    sub_settlement_no: row.sub_settlement_no,
                    expense_date: row.expense_date,
                    settlement_type: row.settlement_type,
                    status_name: row.status_name,
                    event_proposal_no: row.event_proposal_no,
                    unit: row.unit_id,
                    event_name: row.event_name,
                    event_start_date:
                        // row.event_start_date,
                        row.event_start_date
                            ? dayjs(row.event_start_date)
                            : null,
                    event_end_date:
                        // row.event_end_date,
                        row.event_end_date
                            ? dayjs(row.event_end_date)
                            : null,
                    school_id: row.school_id,
                    department_id: row.department_id,
                    name_of_head: row.name_of_head,
                    financial_year: row.financial_year,
                    req_emp_id: row.req_emp_id,
                    req_emp_name: row.req_emp_name,
                    approved_budget: row.approved_budget === null ||
                        row.approved_budget === undefined ||
                        row.approved_budget === ""
                        ? ""
                        : row.approved_budget,
                    adv_amount: row.adv_amount === null ||
                        row.adv_amount === undefined ||
                        row.adv_amount === ""
                        ? ""
                        : row.adv_amount,
                    actual_expense_total: row.actual_expense,
                    balance_excess: row.balance_excess,
                    remarks: row.remarks,
                    acc_holder_name: row.acc_holder_name,
                    acc_number: row.acc_number,
                    ifsc_code: row.ifsc_code,
                    bank_name: row.bank_name,
                    branch: row.branch,
                    acc_type_id: row.acc_type_id,
                    approved_by: row.approved_by,
                    approved_date: row.approved_date,
                    approved_amount: row.approved_amount,
                    approved_remarks: row.approved_remarks,
                    fin_approved_by: row.fin_approved_by,
                    fin_approved_date: row.fin_approved_date,
                    fin_approved_amount: row.fin_approved_amount,
                    fin_remarks: row.fin_remarks
                }));
            }


        });

        console.log("on row select ");
    };

    // Requested Settlement List Grid columns
    const settlementsColumns = [
        {
            field: "settlement_no",
            // headerName: "Settlements No.",
            headerName: "Req No.",
            width: 120,

            renderCell: (params) => (
                <Link
                    component="button"
                    type="button"
                    underline="hover"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRowSelected(params.row);
                    }}
                    sx={{
                        fontSize: "0.80rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    {params.value}
                </Link>
            ),
        },
        {
            field: "sub_settlement_no",
            headerName: "Sub No",
            width: 80,
        },
        {
            field: "department_name",
            headerName: "Department",
            width: 250,
        },
        {
            field: "event_name",
            headerName: "Event Name",
            width: 200,
        },
        {
            field: "request_date",
            headerName: "Request Date",
            width: 130,
            valueFormatter: (value) =>
                value
                    ? new Date(value).toLocaleDateString("en-GB")
                    : "",
        },
        {
            field: "actual_expense",
            headerName: "Amount",
            width: 100,
            renderHeader: () => (
                <div
                    style={{
                        whiteSpace: "normal",
                        lineHeight: "16px",
                        textAlign: "center",
                    }}
                >
                    Amount
                </div>
            ),
            type: "number",
            valueFormatter: (value) =>
                value?.toLocaleString("en-IN"),
        },
        {
            field: "event_proposal_no",
            headerName: "Proposal No",
            width: 120,
        },
        {
            field: "settlement_type",
            headerName: "Type",
            width: 100,
        },

        {
            field: "status_name",
            headerName: "Status",
            width: 100,
        },
    ];

    // Columns for Actual Expenses Grid columns
    const actualExpensesColumns = [
        {
            field: "expense_date",
            headerName: "Date",
            width: 140,
            editable: true,
            type: "date",
            // valueGetter: (value) => (value ? new Date(value) : null),
            valueGetter: (value) => (value ? new Date(value) : null),

            valueFormatter: (value) => {
                if (!value) return "";

                const date = new Date(value);

                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                return `${day}/${month}/${year}`;
            },

        },
        {
            field: "expenses_details",
            headerName: "Expense Details",
            width: 250,
            editable: true,
            type: "text",
        },
        {
            field: "expenses_head",
            headerName: "Expense Head",
            width: 180,
            editable: true,
            type: "text",
            // valueOptions: expenseHeads,
        },
        {
            field: "amount",
            headerName: "Amount",
            width: 120,
            editable: true,
            type: "number",
        },
        {
            field: "has_bill",
            headerName: "Bill (Y/N)",
            width: 120,
            editable: true,
            type: "singleSelect",
            valueOptions: ["Y", "N"],
        },
        {
            field: "paid_to_party",
            headerName: "Paid to Party (Y/N)",
            width: 170,
            editable: true,
            type: "singleSelect",
            valueOptions: ["Y", "N"],
        },
        {
            field: "actions",
            headerName: "Action",
            width: 100,
            sortable: false,
            filterable: false,

            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteExpense(params.row.id)}
                    disabled={disableSubmit}
                >
                    Delete
                </Button>
            ),
        },
    ];

    // Expenses Data save to Grid
    const [totalexpense, setTotaleExpense] = useState(0);
    const [expenseRows, setExpenseRows] = useState([]);
    const [expenseForm, setExpenseForm] = useState({
        expense_date: null,
        expenses_details: "",
        expenses_head: "",
        amount: "",
        has_bill: "N",
        paid_to_party: "N",
    });
    const formatDate = (value) => value ? dayjs(value).format("YYYY-MM-DD") : "";

    const handleExpFieldChange = (field) => (event) => {
        setExpenseForm((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    }

    const handleExpDateChange = (field) => (value) => {
        setExpenseForm((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };
    // Add row handler
    const handleAddExpense = () => {

        if (
            !expenseForm.expense_date ||
            !expenseForm.expenses_details ||
            !expenseForm.expenses_head ||
            !expenseForm.amount
        ) {
            alert("Please fill all mandatory fields. expense_date, expenses_details, expenses_head and amount are mandatory fields");
            return;
        }
        else {
            expenseForm.expense_date = formatDate(expenseForm.expense_date);
        }



        const newRow = {
            id: Date.now(),
            ...expenseForm,
        };


        formData.actual_expense_total = Number(totalexpense) + Number(newRow.amount);
        formData.balance_excess = Number(formData.approved_budget) - (formData.actual_expense_total);
        setTotaleExpense(Number(totalexpense) + Number(newRow.amount));

        setExpenseRows((prev) => [...prev, newRow]);

        // Clear form
        setExpenseForm({
            expense_date: null,
            expenses_details: "",
            expenses_head: "",
            amount: "",
            has_bill: "N",
            paid_to_party: "N",
        });
    };

    // handle New or Sub no request creation 
    const [subsettlement, setSubSettlement] = useState(false);
    const handleNewOrSubSettlement = (field) => {
        handleClear();
        if (field === 'sub') {
            setSubSettlement(true);
            // formData.settlement_no = "";
            // handleClear();
        } else {
            setSubSettlement(false);
        }
    }

    // Delete row handler
    const handleDeleteExpense = (id) => {
        setExpenseRows((prevRows) =>
            prevRows.filter((row) => row.id !== id)
        );
    };

    // event Handler value change of controls
    const handleFieldChange = (field) => (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: event.target.value,

            req_emp_name: JSON.parse(localStorage.getItem("user"))?.name,
            req_emp_id: JSON.parse(localStorage.getItem("user"))?.empId,
        }));
    }

    // event Handler Date change of date controls
    const handleDateChange = (field) => (value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // Attachment handler
    const [attachments, setAttachments] = useState([]);
    const [attachmentError, setAttachmentError] = useState(false);
    const handleFiles = (files) => {
        setAttachments(files);
        setAttachmentError(files.length === 0);
        console.log("Selected Files:");
        files.forEach((file) => {
            console.log(file.name);
        });
    };
    // to load the attached file
    const [filelist, setFileList] = useState([]);


    // const [attachmentError, setAttachmentError] = useState(false);
    // const [attachments, setAttachments] = useState([]);

    const {
        loading: settlementSubmitting,
        error: settlementSubmitError,
        submitSettlement,
    } = useSettlementPOST();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitSuccess(false);
        setDisableSubmit(true);

        if (attachments.length === 0 && formData.proposal === 2) {
            setAttachmentError(true);
            alert("Please upload Bills (Attachments).");
            return;
        } else {
            setAttachmentError(false);
        }

        const attachmentList = attachments.map((file, index) => ({
            sequence: index + 1,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
        }));

        const settlementJson = {
            settlement_no: subsettlement === true
                ? formData.settlement_no
                : null,
            sub_settlement_no: formData.sub_settlement_no,
            // request_date: formatDate(formData.request_date),
            request_date: formData.request_date,
            settlement_type: formData.settlement_type,
            event_proposal_no: formData.event_proposal_no,
            status_id: 2,
            unit_id: formData.unit,
            event_name: formData.event_name,
            event_start_date: formatDate(formData.event_start_date),
            event_end_date: formatDate(formData.event_end_date),
            school_id: formData.school_id,
            department_id: formData.department_id,
            name_of_head: formData.name_of_head,
            financial_year: formData.financial_year,
            req_emp_id: formData.req_emp_id,
            req_emp_name: formData.req_emp_name,
            manager_id: JSON.parse(localStorage.getItem("user"))?.manager_id,
            approved_budget:
                formData.approved_budget &&
                    formData.approved_budget !== ""
                    ? parseFloat(formData.approved_budget).toFixed(2)
                    : null,
            // formData.approved_budget &&
            // formData.approved_budget !== ""
            // ? formatDate(formData.approved_budget)
            // : null,
            adv_amount: formData.adv_amount &&
                formData.adv_amount !== ""
                ? parseFloat(formData.adv_amount).toFixed(2)
                : null,
            // formData.adv_amount &&
            // formData.adv_amount !== ""
            // ? formatDate(formData.adv_amount)
            // : null,
            actual_expense: parseFloat(formData.actual_expense_total).toFixed(2),
            // formData.actual_expense_total &&
            // formData.actual_expense_total !== ""
            // ? formatDate(Number(formData.actual_expense_total))
            // : null,
            balance_excess: parseFloat(formData.balance_excess).toFixed(2),
            // formData.balance_excess &&
            // formData.balance_excess !== ""
            // ? formatDate(formData.balance_excess)
            // : null,
            remarks: formData.remarks,
            acc_holder_name: formData.acc_holder_name,
            acc_number: formData.acc_number,
            ifsc_code: formData.ifsc_code,
            bank_name: formData.bank_name,
            branch: formData.branch,
            acc_type_id:
                formData.acc_type_id &&
                    formData.acc_type_id !== ""
                    ? formData.acc_type_id
                    : null,
            attachments: attachmentList,
            expenses: expenseRows
        }

        try {
            const response = await submitSettlement(settlementJson);
            console.log("API Response:", response);
            setSettlementResponse(response);
            setSubmitSuccess(true);

            setFormData((prev) => ({
                ...prev,
                settlement_no:
                    response[0]?.settlement_no ||
                    prev.settlement_no,
            }));

            // window.location.reload();
            setTimeout(() => {
                window.location.reload();
            }, 10000);

        } catch (error) {
            console.error(error);
            setSubmitSuccess(false);
        }


    };

    // Clear form data and controls values

    const initialFormData = {
        settlement_no: "ESN-",
        sub_settlement_no: "",
        request_date: TodayformattedDate,
        settlement_type: "",
        status: "Draft",
        event_proposal_no: "",
        unit: "",
        event_name: "",
        event_start_date: null,
        event_end_date: null,
        school_id: "",
        department_id: "",
        name_of_head: "",
        financial_year: getFinancialYear(),
        req_emp_id: JSON.parse(localStorage.getItem("user"))?.empId,
        req_emp_name: JSON.parse(localStorage.getItem("user"))?.name,
        manager_id: "",
        approved_budget: "",
        adv_amount: "",
        actual_expense_total: "",
        balance_excess: "",
        remarks: "",
        acc_holder_name: "",
        acc_number: "",
        ifsc_code: "",
        bank_name: "",
        branch: "",
        acc_type_id: "",
        created_at: null,
        approved_by: "",
        approved_date: null,
        approved_amount: "",
        approved_remarks: "",
        fin_approved_by: "",
        fin_approved_date: "",
        fin_approved_amount: "",
        fin_remarks: "",
        status_name: "Draft",
        department_name: "",
    };

    const handleClear = () => {
        setDisableSubmit(false);
        setFormData(initialFormData);
        // setShowFileUpload(true);
        // setshowFileList(false);
        setFileList([]);
        setAttachments([]);
        // setApproverSection(false);

        // Clear any validation errors if applicable
        setAttachmentError(false);
        // setErrors({});

        setExpenseRows([]);
    };

    // No Blur event for Proposal text box
    const handleProposalNoBlur = async (event) => {
        const proposalNo = event.target.value.trim();

        // Don't call API if textbox is empty
        if (!proposalNo) {
            return;
        }

        // Validate Proposal No format
        if (!/^EBP-\d{4}$/.test(proposalNo)) {
            alert("Please enter a valid Proposal No. Example: EBP-0008");
            return;
        }

        try {
            // const response = await axios.get(
            //     `${import.meta.env.VITE_API_URL}/event-budget-proposal/${proposalNo}`
            // );

            const response = await getProposaReqNo(proposalNo);

            console.log("Proposal data:", response.data);

            if (response.success) {
                const proposal = response.data[0];

                // Set the returned data into your form
                setFormData((prev) => ({
                    ...prev,

                    approved_budget: proposal.fin_approved_amount,
                    adv_amount: proposal.advance_amount,
                    unit: proposal.unit_id,
                    event_name: proposal.event_name,
                    event_start_date:
                        // formatDate(proposal.event_start_date),
                        proposal.event_start_date
                            ? dayjs(proposal.event_start_date)
                            : null,
                    event_end_date:
                        proposal.event_end_date
                            ? dayjs(proposal.event_end_date)
                            : null,
                    school_id: proposal.school_id,
                    department_id: proposal.department_id,
                    name_of_head: proposal.name_of_head,
                    financial_year: proposal.financial_year,
                }));
            } else {
                alert("Proposal No not found.");
            }

        } catch (error) {
            console.error("Error fetching proposal:", error);

            alert("Unable to fetch Proposal details.");
        }
    };

    // check the settlement No and sub settlement no is exist or not
    const checkSettlementNo = async (subSettlementNo) => {
        try {

            // const response = await getCheckSettlement

            const settlementJson = {
                settlement_no: formData.settlement_no,
                sub_settlement_no: subSettlementNo,
                req_emp_id: formData.req_emp_id,
            }

            const response = await getCheckSettlement(settlementJson);

            // setTotaleExpense(response.data[0].total_actual_expenses)
            // formData.actual_expense_total = Number(response.data[0].total_actual_expenses);
            console.log("API response:", response.data);

            return true;

        } catch (error) {

            if (error.response?.status === 409) {
                formData.sub_settlement_no = "";
                alert(error.response.data.message);
            } else {
                console.error("Check settlement error:", error);
                alert("Unable to check settlement number.");
            }

            return false;
        }
    };

    return (
        <SectionCard title="">
            <Box component="form" onSubmit={handleSubmit}>
                {/* Settlements List */}
                <fieldset>
                    <legend>Requested Settlement</legend>
                    <Box sx={{ height: 370, width: 1000 }}>
                        <DataGrid
                            rows={rows}
                            columns={settlementsColumns}
                            getRowClassName={(params) =>
                                [6, 4].includes(params.row.status_id)
                                    ? "rejected-row"
                                    : ""
                            }
                            loading={loading}
                            pageSizeOptions={[5, 10, 20, 50]}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            disableRowSelectionOnClick
                            getRowHeight={() => "auto"}

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
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",

                                },

                                // Footer
                                "& .MuiDataGrid-footerContainer": {
                                    fontSize: "0.80rem",
                                },
                            }}

                        />
                    </Box>
                    <Grid container spacing={3}>

                        <FormControl required sx={formControl3rows} >
                            <Button
                                variant="contained"
                                onClick={() => handleNewOrSubSettlement('new')}
                                sx={{ mb: 2 }}
                            >
                                Request New Settlement
                            </Button>
                        </FormControl>

                        <FormControl required sx={formControl3rows} >
                            <Button
                                variant="contained"
                                onClick={() => handleNewOrSubSettlement('sub')}
                                sx={{ mb: 2 }}
                            >
                                Request Sub Settlement
                            </Button>
                        </FormControl>
                    </Grid>
                </fieldset>

                {/* Settlements Information */}
                <fieldset >
                    <legend>Settlement Information</legend>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={3}>
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    label="Settlement No."
                                    value={formData.settlement_no}
                                    onChange={handleFieldChange("settlement_no")}
                                    required={!subsettlement}
                                    error={!subsettlement && !formData.settlement_no}
                                    helperText={
                                        !subsettlement && !formData.settlement_no
                                            ? "Settlement No. is required"
                                            : ""
                                    }
                                    slotProps={{
                                        input: { readOnly: !subsettlement },
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.settlement_no ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.settlement_no ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>

                            <FormControl sx={formControl3rows} >
                                <InputLabel id="lblSubNo" sx={{
                                    color: formData.sub_settlement_no
                                        ? "blue"
                                        : "red",

                                    "&.Mui-focused": {
                                        color: formData.sub_settlement_no
                                            ? "blue"
                                            : "red",
                                    },
                                }}>Sub Settlement No.</InputLabel>
                                <Select
                                    labelId="lblSubNo"
                                    id="ddlSubNo"
                                    value={formData.sub_settlement_no}
                                    label="Sub Settlement No"

                                    required
                                    error={
                                        !formData.sub_settlement_no
                                    }

                                    onChange={(e) => {
                                        handleFieldChange("sub_settlement_no")(e);

                                        checkSettlementNo(e.target.value);
                                    }}

                                    sx={{
                                        height: 50,
                                        '& .MuiSelect-select': {
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    // Limits the height of the expanded overlay list menu
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="-">-</MenuItem>
                                    <MenuItem value="A">A</MenuItem>
                                    <MenuItem value="B">B</MenuItem>
                                    <MenuItem value="C">C</MenuItem>
                                    <MenuItem value="D">D</MenuItem>
                                    <MenuItem value="E">E</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    label="Request Date"
                                    value={formData.request_date}
                                    onChange={handleFieldChange("request_date")}
                                    slotProps={{
                                        input: { readOnly: true },
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.request_date ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.request_date ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {/* 2nd Row  Settlement Type Status */}
                        <Grid container spacing={3}>
                            <FormControl sx={formControl3rows} >
                                <InputLabel id="lblSettlementType" required sx={{
                                    color: formData.settlement_type
                                        ? "blue"
                                        : "red",

                                    "&.Mui-focused": {
                                        color: formData.settlement_type
                                            ? "blue"
                                            : "red",
                                    },
                                }}>Choose Settlement Type</InputLabel>
                                <Select
                                    labelId="lblSettlementType"
                                    id="ddlSettlementType"
                                    value={formData.settlement_type}
                                    required
                                    error={
                                        !formData.settlement_type
                                    }
                                    label="Choose Settlement Type"
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        if (value === 1) {
                                            alert(`While Selecting Settlement Type "Even", you should have Proposal No. If Not Please raise Settlement Type “Individual”.`);
                                        } else {
                                            formData.event_proposal_no = "  ";
                                        }

                                        handleFieldChange("settlement_type")(event);
                                    }}
                                    // Controls the structural height of the selector input box
                                    sx={{
                                        height: 50,
                                        '& .MuiSelect-select': {
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    // Limits the height of the expanded overlay list menu
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                            },
                                        },
                                    }}
                                >
                                    {settlementtype.map((st) => (
                                        <MenuItem
                                            key={st.id}
                                            value={st.id}
                                        >
                                            {st.name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                            <FormControl sx={formControl3rows} >
                                <TextField
                                    label="Status"
                                    value={formData.status_name}
                                    onChange={handleFieldChange("status_name")}
                                    slotProps={{
                                        input: { readOnly: true },
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.status_name ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.status_name ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {/* 3rd Row  Proposal No, Units and Event Name */}
                        <Grid container spacing={3}>
                            <FormControl sx={formControl3rows} >
                                <TextField
                                    label="Proposal No"
                                    value={formData.event_proposal_no}
                                    placeholder="EBP-"
                                    onChange={handleFieldChange("event_proposal_no")}

                                    required={formData.settlement_type === 1 || formData.settlement_type === "1"}
                                    error={
                                        (formData.settlement_type === 1 || formData.settlement_type === "1") &&
                                        !formData.event_proposal_no
                                    }
                                    helperText={
                                        (formData.settlement_type === 1 || formData.settlement_type === "1") &&
                                            !formData.event_proposal_no
                                            ? "Proposal No is required"
                                            : ""
                                    }

                                    onBlur={handleProposalNoBlur}
                                // slotProps={{
                                //     input: { readOnly: true },
                                // }}
                                />
                            </FormControl>

                            <FormControl sx={formControl3rows} >
                                <InputLabel id="lblUnit" required sx={{
                                    color: formData.unit
                                        ? "blue"
                                        : "red",

                                    "&.Mui-focused": {
                                        color: formData.unit
                                            ? "blue"
                                            : "red",
                                    },
                                }}>Choose Unit</InputLabel>
                                <Select
                                    labelId="lblUnit"
                                    id="ddlUnit"
                                    value={formData.unit}
                                    required
                                    error={
                                        !formData.unit
                                    }
                                    label="Choose Unit"
                                    onChange={handleFieldChange("unit")}
                                    // Controls the structural height of the selector input box
                                    sx={{
                                        height: 50,
                                        '& .MuiSelect-select': {
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    // Limits the height of the expanded overlay list menu
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                            },
                                        },
                                    }}
                                >
                                    {units.map((unit) => (
                                        <MenuItem
                                            key={unit.unit_id}
                                            value={unit.unit_id}
                                        >
                                            {unit.unit_name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>

                            <FormControl sx={formControl3rows} >
                                <TextField
                                    label="Event Name"
                                    value={formData.event_name}
                                    placeholder="Event Name"
                                    required
                                    error={
                                        !formData.event_name
                                    }
                                    onChange={handleFieldChange("event_name")}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.event_name ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.event_name ? "blue" : "red",
                                        },
                                    }}
                                // slotProps={{
                                //     input: { readOnly: true },
                                // }}

                                />
                            </FormControl>

                        </Grid>
                        {/* 4th Row  Event Start and End Date */}
                        <Grid container spacing={3}>
                            <FormControl sx={formControl3rows}>
                                <DatePicker
                                    label="Start Date"
                                    format="DD-MM-YYYY"
                                    value={formData.event_start_date}
                                    onChange={handleDateChange("event_start_date")}

                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                            error: !formData.event_start_date,
                                            sx: {
                                                "& .MuiInputLabel-root": {
                                                    color: formData.event_start_date
                                                        ? "blue"
                                                        : "red",
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: formData.event_start_date
                                                        ? "blue"
                                                        : "red",
                                                },
                                            },
                                        }


                                    }}
                                />
                            </FormControl>
                            {/* Event End Date */}
                            <FormControl sx={formControl3rows}>
                                <DatePicker
                                    label="End Date"
                                    format="DD-MM-YYYY"
                                    value={formData.event_end_date}
                                    minDate={formData.event_start_date}
                                    onChange={handleDateChange("event_end_date")}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true,
                                            error: !formData.event_end_date,
                                            sx: {
                                                "& .MuiInputLabel-root": {
                                                    color: formData.event_end_date
                                                        ? "blue"
                                                        : "red",
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: formData.event_end_date
                                                        ? "blue"
                                                        : "red",
                                                },
                                            },
                                        }
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {/* 5th Row  School, department and head of Department */}
                        <Grid container spacing={3}>
                            <FormControl sx={formControl3rows}>
                                <InputLabel id="lblSchool" required sx={{
                                    color: formData.school_id
                                        ? "blue"
                                        : "red",

                                    "&.Mui-focused": {
                                        color: formData.school_id
                                            ? "blue"
                                            : "red",
                                    },
                                }}>Choose School</InputLabel>
                                <Select
                                    labelId="lblSchool"
                                    id="ddlSchool"
                                    value={formData.school_id}
                                    required
                                    error={
                                        !formData.settlement_type
                                    }
                                    label="Choose School"
                                    onChange={(e) => {
                                        const schoolId = Number(e.target.value);

                                        setFormData((prevData) => ({
                                            ...prevData,
                                            school_id: schoolId,
                                            department_id: "",
                                            headerName: "",
                                        }));
                                    }}
                                    // Controls the structural height of the selector input box
                                    sx={{
                                        height: 50,
                                        '& .MuiSelect-select': {
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    // Limits the height of the expanded overlay list menu
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                            },
                                        },
                                    }}
                                >
                                    {schools.map((school) => (
                                        <MenuItem
                                            key={school.school_Id}
                                            name={school.school_name}
                                            value={school.school_Id}
                                        >
                                            {school.school_name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                            {/* Department Drop down */}
                            <FormControl sx={formControl3rows}>
                                <InputLabel id="lbldept" required sx={{
                                    color: formData.department_id
                                        ? "blue"
                                        : "red",

                                    "&.Mui-focused": {
                                        color: formData.department_id
                                            ? "blue"
                                            : "red",
                                    },
                                }}>Choose Department</InputLabel>
                                <Select
                                    labelId="lbldept"
                                    id="ddlDept"
                                    value={formData.department_id}
                                    required
                                    error={
                                        !formData.department_id
                                    }
                                    label="Choose Department"
                                    onChange={(e) => {
                                        const deptId = Number(e.target.value);
                                        const selectedDepartment = departments.find(
                                            (dept) => dept.department_Id === deptId
                                        );

                                        setFormData((prevData) => ({
                                            ...prevData,
                                            department_id: deptId,
                                            name_of_head: selectedDepartment?.department_head || "",
                                        }));

                                    }}
                                    // disabled={!formData.schoolId || deptLoading}
                                    // Controls the structural height of the selector input box
                                    sx={{
                                        height: 50,
                                        '& .MuiSelect-select': {
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    // Limits the height of the expanded overlay list menu
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                            },
                                        },
                                    }}
                                >
                                    {deptError && (
                                        <MenuItem value="" disabled>
                                            Error loading departments
                                        </MenuItem>
                                    )}
                                    {departments.map((dept) => (
                                        <MenuItem
                                            key={dept.department_Id}
                                            value={dept.department_Id}
                                        >
                                            {dept.department_name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                            {/* Head Text Box */}
                            <FormControl sx={formControl3rows}>
                                <TextField
                                    label="Name of Head"
                                    placeholder="Auto populate based on Dept"
                                    id="txtHead"
                                    value={formData.name_of_head}
                                    slotProps={{
                                        input: { readOnly: true },
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.name_of_head ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.name_of_head ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {/* 6th Row  Emp Id, Emp Name */}
                        <Grid container spacing={3}>
                            {/* Employee Id Drop down */}
                            <FormControl sx={formControl3rows}>
                                {/* <InputLabel id="lblEmpId" required>Choose Employee Id</InputLabel> */}
                                <TextField
                                    label="Requester Emp ID"
                                    placeholder="Auto Employee Id"
                                    id="txtEmpId"
                                    value={formData.req_emp_id}
                                    slotProps={{
                                        input: { readOnly: true },
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.req_emp_id ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.req_emp_id ? "blue" : "red",
                                        },
                                    }}
                                />

                            </FormControl>
                            {/* Employee Name Text Box */}
                            <FormControl sx={formControl3rows}>
                                <TextField
                                    label="Requester Name"
                                    placeholder="Auto populate based on Employee Id"
                                    id="txtEmp"
                                    value={formData.req_emp_name}
                                    slotProps={{
                                        input: { readOnly: true },
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.req_emp_name ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.req_emp_name ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>
                            {/* Financial Year Text Box */}
                            <FormControl sx={formControl3rows}>
                                <TextField
                                    label="Financial Year"
                                    placeholder="Auto populate Financial Year"
                                    id="txtFY"
                                    value={getFinancialYear()}
                                    slotProps={{
                                        input: { readOnly: true },
                                    }}

                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: "blue",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "blue",
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </LocalizationProvider>
                </fieldset>
                {/* Actual Expenses */}
                <fieldset >
                    <legend>Actual Expenses</legend>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={3}>
                            <FormControl required sx={formControl3rows} >
                                <DatePicker
                                    label="Expense Date"
                                    id="datExpenseDate"
                                    format="DD-MM-YYYY"
                                    value={expenseForm.expense_date}
                                    onChange={handleExpDateChange("expense_date")}
                                    
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            // required: true,
                                            error: !expenseForm.expense_date,
                                            sx: {
                                                "& .MuiInputLabel-root": {
                                                    color: expenseForm.expense_date
                                                        ? "blue"
                                                        : "red",
                                                },
                                                "& .MuiInputLabel-root.Mui-focused": {
                                                    color: expenseForm.expense_date
                                                        ? "blue"
                                                        : "red",
                                                },
                                            },
                                            
                                        }

                                    }}
                                />
                            </FormControl>
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    label="Expenses Details"
                                    placeholder="Expenses Details"
                                    id="txtExpenseDetails"
                                    value={expenseForm.expenses_details}
                                    onChange={handleExpFieldChange("expenses_details")}
                                    // required
                                    error={
                                        !expenseForm.expenses_details
                                    }
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: expenseForm.expenses_details ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: expenseForm.expenses_details ? "blue" : "red",
                                        },
                                    }}
                                // slotProps={{
                                //     input: { readOnly: true },
                                // }}
                                />
                            </FormControl>
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    label="Expenses Head"
                                    placeholder="Expenses Head"
                                    id="txtExpenseHead"
                                    value={expenseForm.expenses_head}
                                    onChange={handleExpFieldChange("expenses_head")}

                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: expenseForm.expenses_head ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: expenseForm.expenses_head ? "blue" : "red",
                                        },
                                    }}
                                // slotProps={{
                                //     input: { readOnly: true },
                                // }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container spacing={3}>
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    type="number"
                                    id="txtAmount"
                                    label="Amount"
                                    placeholder="Amount"
                                    // required
                                    error={
                                        !expenseForm.amount
                                    }
                                    
                                    value={expenseForm.amount}
                                    onChange={handleExpFieldChange("amount")}
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-", "ArrowUp", "ArrowDown"].includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}

                                    onWheel={(e) => e.target.blur()}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: expenseForm.amount ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: expenseForm.amount ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>
                            <FormControl required sx={formControl3rows} >
                                <InputLabel id="lblIsBill" sx={{
                                    color: expenseForm.has_bill
                                        ? "blue"
                                        : "red",

                                    "&.Mui-focused": {
                                        color: expenseForm.has_bill
                                            ? "blue"
                                            : "red",
                                    },
                                }}>Choose Bill (Y/N)</InputLabel>
                                <Select
                                    labelId="lblIsBill"
                                    id="ddlIsBill"
                                    value={expenseForm.has_bill}
                                    label="Choose Bill (Y/N)"
                                    onChange={handleExpFieldChange("has_bill")}
                                    // onChange={(e) => {
                                    //     handleFieldChange("sub_settlement_no")(e);
                                    // }}
                                    sx={{
                                        height: 50,
                                        '& .MuiSelect-select': {
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    // Limits the height of the expanded overlay list menu
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Y">Y</MenuItem>
                                    <MenuItem value="N">N</MenuItem>

                                </Select>
                            </FormControl>

                            <FormControl sx={formControl3rows} >
                                <InputLabel id="lblIsBill" sx={{
                                    color: expenseForm.paid_to_party
                                        ? "blue"
                                        : "red",

                                    "&.Mui-focused": {
                                        color: expenseForm.paid_to_party
                                            ? "blue"
                                            : "red",
                                    },
                                }}>Choose paid to Party (Y/N)</InputLabel>
                                <Select
                                    labelId="lblIsPpaid_to_Party"
                                    id="ddlIsPpaid_to_Party"
                                    value={expenseForm.paid_to_party}
                                    label="Choose paid to Party (Y/N)"
                                    onChange={handleExpFieldChange("paid_to_party")}
                                    // onChange={(e) => {
                                    //     handleFieldChange("sub_settlement_no")(e);
                                    // }}
                                    sx={{
                                        height: 50,
                                        '& .MuiSelect-select': {
                                            height: 50,
                                            display: 'flex',
                                            alignItems: 'center',
                                            boxSizing: 'border-box',
                                        }
                                    }}
                                    // Limits the height of the expanded overlay list menu
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Y">Y</MenuItem>
                                    <MenuItem value="N">N</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                        <Box sx={{ height: 370, width: 1000 }}>
                            <Button
                                variant="contained"
                                onClick={handleAddExpense}
                                sx={{ mb: 2 }}
                                disabled={disableSubmit}
                            >
                                Add Expense
                            </Button>
                            <DataGrid
                                rows={expenseRows}
                                columns={actualExpensesColumns}
                                // processRowUpdate={processRowUpdate}
                                // experimentalFeatures={{ newEditingApi: true }}
                                // disableRowSelectionOnClick
                                // autoHeight
                                pageSizeOptions={[5, 10]}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        },
                                    },
                                }}
                                sx={{
                                    // Header
                                    height: 320,
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
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",

                                    },

                                    // Footer
                                    "& .MuiDataGrid-footerContainer": {
                                        fontSize: "0.80rem",
                                    },
                                }}


                            />



                        </Box>
                    </LocalizationProvider>

                </fieldset>

                {/* Budget Summary */}
                <fieldset >
                    <legend>Budget Summary</legend>
                    <Grid container spacing={3}>
                        <FormControl required sx={formControl4rows} >
                            <TextField
                                type="number"
                                id="txtApprovedAmount"
                                label="Approved Amount (A)"
                                placeholder="Approved Amount (A)"

                                value={formData.approved_budget}
                                onChange={handleExpFieldChange("approved_budget")}
                                slotProps={{
                                    input: { readOnly: true },
                                }}
                            />
                        </FormControl>
                        <FormControl required sx={formControl4rows} >
                            <TextField
                                type="number"
                                id="txtAdvAmount"
                                label="Adv Amount (B)"
                                placeholder="Adv Amount (B)"

                                value={formData.adv_amount}
                                onChange={handleExpFieldChange("adv_amount")}
                                slotProps={{
                                    input: { readOnly: true },
                                }}
                            />
                        </FormControl>
                        <FormControl required sx={formControl4rows} >
                            <TextField
                                type="number"
                                id="txtActualExpense"
                                label="Actual Expense (c)"
                                placeholder="Actual Expense (C)"
                                value={formData.actual_expense_total}
                                onChange={handleExpFieldChange("actual_expense_total")}
                                slotProps={{
                                    input: { readOnly: true },
                                }}
                            />
                        </FormControl>
                        <FormControl required sx={formControl4rows} >
                            <TextField
                                type="number"
                                id="txtBalanceExpense"
                                label="Balance/Excess (A-C)"
                                placeholder="Balance/Excess (A-C)"

                                value={formData.balance_excess}
                                onChange={handleExpFieldChange("balance_excess")}
                                slotProps={{
                                    input: { readOnly: true },
                                }}
                            />
                        </FormControl>
                    </Grid>
                </fieldset>

                {/* Supporting Documents */}
                <fieldset >
                    <legend>Supporting Documents</legend>
                    <Grid container spacing={3}>
                        <FormControl sx={formControl2rows} >
                            <FileUpload
                                label="Upload Bills"
                                multiple={true}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                                onFilesChange={handleFiles}
                                required

                            />
                            <box>
                                {Number(formData.proposal) === 2 && attachmentError && (
                                    <Typography color="error" variant="caption">
                                        Attachment is required.
                                    </Typography>
                                )}
                                <Typography mt={3}>
                                    Total Files : {attachments.length}
                                </Typography>
                            </box>

                        </FormControl>
                        <FormControl required sx={formControl2rows} >
                            <TextField
                                label="Remarks"
                                placeholder="Remarks"
                                id="txtRemarks"
                                value={expenseForm.remarks}
                                onChange={handleExpFieldChange("remarks")}
                                multiline
                                rows={2}
                                required
                                error={
                                    !expenseForm.remarks
                                }

                                sx={{
                                        "& .MuiInputLabel-root": {
                                            color: expenseForm.remarks ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: expenseForm.remarks ? "blue" : "red",
                                        },
                                    }}
                                
                            // slotProps={{
                            //     input: { readOnly: true },
                            // }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid container spacing={3}>
                        <FormControl required sx={formControl2rows} >
                            <FormControl sx={formControl3rows}>
                                <AttachmentList files={filelist} />
                            </FormControl>
                        </FormControl>
                    </Grid>
                </fieldset>

                <h5>BANK DETAILS OF PARTY TO WHOM PAYMENT HAS TO BE MADE</h5>
                {/* BANK DETAILS 1st row */}
                <Grid container spacing={3}>
                    {/* ACCOUNT HOLDER NAME */}
                    <FormControl sx={formControl3rows}>
                        <TextField
                            label="ACCOUNT HOLDER NAME"
                            placeholder="ACCOUNT HOLDER NAME"
                            value={formData.acc_holder_name}
                            onChange={handleFieldChange("acc_holder_name")}
                        />
                    </FormControl>
                    {/* ACCOUNT NUMBER */}
                    <FormControl sx={formControl3rows}>
                        <TextField
                            type="number"
                            label="ACCOUNT NUMBER"
                            placeholder="ACCOUNT NUMBER"
                            value={formData.acc_number}
                            onChange={handleFieldChange("acc_number")}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "ArrowUp", "ArrowDown"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}

                            onWheel={(e) => e.target.blur()}
                            sx={{
                                "& input[type=number]": {
                                    MozAppearance: "textfield",
                                },
                                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                },
                            }}
                        />
                    </FormControl>
                    {/* IFSC CODE */}
                    <FormControl sx={formControl3rows}>
                        <TextField
                            label="IFSC CODE"
                            placeholder="IFSC CODE"
                            value={formData.ifsc_code}
                            onChange={handleFieldChange("ifsc_code")}
                        />
                    </FormControl>

                </Grid>

                {/* BANK DETAILS 2nd row */}
                <Grid container spacing={3}>
                    {/* BANK NAME */}
                    <FormControl sx={formControl3rows}>
                        <TextField
                            label="BANK NAME"
                            placeholder="BANK NAME  "
                            value={formData.bankNbank_nameame}
                            onChange={handleFieldChange("bank_name")}
                        />
                    </FormControl>
                    {/* BRANCH */}
                    <FormControl sx={formControl3rows}>
                        <TextField
                            label="BRANCH"
                            placeholder="BRANCH"
                            value={formData.branch}
                            onChange={handleFieldChange("branch")}
                        />
                    </FormControl>
                    {/* A/C Type */}
                    <FormControl sx={formControl3rows}>
                        <InputLabel id="lblAccType">Choose Account Type</InputLabel>
                        <Select
                            labelId="lblAccType"
                            id="ddlAccType"
                            value={formData.acc_type_id}
                            label="Choose Account Type"
                            onChange={handleFieldChange("acc_type_id")}
                            // Controls the structural height of the selector input box
                            sx={{
                                height: 50,
                                '& .MuiSelect-select': {
                                    height: 50,
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxSizing: 'border-box',
                                }
                            }}
                            // Limits the height of the expanded overlay list menu
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 200,
                                    },
                                },
                            }}
                        >
                            {acctypes.map((acc) => (
                                <MenuItem
                                    key={acc.id}
                                    value={acc.id}
                                >
                                    {acc.acc_name}
                                </MenuItem>
                            ))}

                        </Select>

                    </FormControl>

                </Grid>
                {submitSuccess && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        <strong>Settlement proposal submitted successfully</strong>

                        <br />

                        settlement_no:{" "}
                        {settlementResponse[0]?.settlement_no}

                    </Alert>
                )}

                {settlementSubmitError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Failed to Submit Settlement Proposal.
                    </Alert>
                )}

                {/* Submit and Clear button */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2, // spacing between buttons
                        mt: 2,  // optional top margin
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={settlementSubmitting || disableSubmit}
                    >
                        {settlementSubmitting ? "Submitting..." : "Submit"}
                        {/* Submit */}
                    </Button>

                    <Button
                        variant="contained"
                        type="button"
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </Box>

            </Box>



        </SectionCard>
    );
}
