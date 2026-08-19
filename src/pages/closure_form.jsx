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
import SectionCard from "../components/SectionCard";
import '../styles/event.css';
import { formControl3rows, formControl2rows, formControl4rows } from "../styles/commonStyles.js";
// Header Component
import { useHeader } from "../components/HeaderContext.jsx";

// Load units data from API
import useUnits from "../hooks/useUnits.js";
// Load schools data from API
import useSchools from "../hooks/useSchool";
// Load departments data from API
import useDept from "../hooks/useDept";
// get Proposal details from service aPI
import { getProposaReqNo } from "../services/proposals_req_no_Service.js";
// get Advance Amount details from service API
import useAdvAmountGet from "../hooks/useAdvAmountGet";
// get payment mode details from service API
import usePaymentMode from "../hooks/usePaymentMode";

export default function ClosureForm() {
    const { setHeaderTitle } = useHeader();
    setHeaderTitle("Closure Form")
    const [reqId, setReqId] = useState("");
    // Load Advance Amount hook details from API
    const {
        rowsAdvAmt,
        loadingAdvAmt,
    } = useAdvAmountGet(reqId); 

    const totalAmount = rowsAdvAmt.reduce(
        (sum, row) => sum + Number(row.amount || 0),
        0
    );

    // Disable Submit button handler
    const [disableSubmit, setDisableSubmit] = useState(false);

    // Load Payment Mode hook details from API
    const { paymentmode } = usePaymentMode();

    // Set form data
    const [formData, setFormData] = useState({
        proposal_no: "EBP-",
        sub_settlement_no: "",
        // request_date: TodayformattedDate,
        request_date: null,
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
        // financial_year: getFinancialYear(),
        financial_year: "",
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
        // status_name: "Draft",
        status_name: null,
        department_name: "",
        event_duration: "",
        event_authorised_person: "",
        total_collection: "",
        income_collection_details: "",
        report_prepared_by: "",
        total_expenses: "",
        report_checked_and_verified_by: "",
        amount_receivable_payable_by_university: ""
    });

    const [expenseRows, setExpenseRows] = useState([]);
    // Set expenseForm data
    const [expenseForm, setExpenseForm] = useState({
        expenses_head: "",
        vendor_name: "",
        // request_date: TodayformattedDate,
        narration: "",
        payment_mode: "",
        qty: "",
        rate: "",
        amount: "",
    });

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

    const getDurationInDays = () => {
        if (!formData.event_start_date || !formData.event_end_date) {
            return 0;
        }

        const start = new Date(formData.event_start_date);
        const end = new Date(formData.event_end_date);
        const duration = Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        ) + 1;

        // formData.event_duration = duration;
        return Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        ) + 1;
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

            const response = await getProposaReqNo(proposalNo);

            console.log("Proposal data:", response.data);

            if (response.success) {
                const proposal = response.data[0];
                setReqId(proposal.id); // Set the reqId state for Advance Amount hook
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
                    event_duration:"",
                    event_authorised_person: proposal.req_emp_name,
                }));

                
            } else {
                alert("Proposal No not found.");
            }

        } catch (error) {
            console.error("Error fetching proposal:", error);

            alert("Unable to fetch Proposal details.");
        }
    };    

// event Handler value change of controls for Expence 
    const handleExpFieldChange = (field) => (event) => {

        // setExpenseForm((prevData) => ({
        //     ...prevData,
        //     [field]: event.target.value,
        // }));

        const value = event.target.value;

        setExpenseForm((prevData) => {

            const updatedData = {
                ...prevData,
                [field]: value,
            };

            const qty =
                parseFloat(updatedData.qty) || 0;

            const rate =
                parseFloat(updatedData.rate) || 0;

            // Automatically calculate amount
            if (
                field === "qty" ||
                field === "rate"
            ) {

                const amount = qty * rate;

                updatedData.amount =
                    amount > 0
                        ? amount.toFixed(2)
                        : "";
            }

            return updatedData;
        });

    }

    // CALCULATE TOTAL EXPENSE
    const calculateTotalExpense = (rows) => {

        return rows.reduce(
            (total, row) =>
                total +
                (parseFloat(row.amount) || 0),
            0
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

    // Add row handler for Expenses Grid
    const handleAddExpense = () => {

        if (!expenseForm.expenses_head) {

            alert("Please enter Expenses Head.");
            return;
        }

        if (!expenseForm.vendor_name) {

            alert("Please enter Vendor Name.");
            return;
        }

        if (!expenseForm.narration) {

            alert("Please enter Narration.");
            return;
        }

        if (!expenseForm.payment_mode) {

            alert("Please select Payment Mode.");
            return;
        }

        if (!expenseForm.qty) {

            alert("Please enter Quantity.");
            return;
        }

        if (!expenseForm.rate) {

            alert("Please enter Rate.");
            return;
        }


        const qty =
            parseFloat(expenseForm.qty) || 0;

        const rate =
            parseFloat(expenseForm.rate) || 0;

        const amount = qty * rate;


        if (amount <= 0) {

            alert(
                "Quantity and Rate must be greater than zero."
            );

            return;
        }


        const newRow = {

            id: Date.now(),

            expenses_head:
                expenseForm.expenses_head,

            vendor_name:
                expenseForm.vendor_name,

            narration:
                expenseForm.narration,

            payment_mode:
                expenseForm.payment_mode,

            qty: qty,

            rate: rate,

            amount: Number(
                amount.toFixed(2)
            ),
        };


        setExpenseRows((prevRows) => {

            const updatedRows = [
                ...prevRows,
                newRow,
            ];

            const total =
                calculateTotalExpense(
                    updatedRows
                );

            const approvedBudget =
                parseFloat(
                    formData.approved_budget
                ) || 0;


            setFormData((prevData) => ({
                ...prevData,

                actual_expense_total:
                    Number(total.toFixed(2)),

                balance_excess:
                    Number(
                        (
                            approvedBudget - total
                        ).toFixed(2)
                    ),
            }));


            return updatedRows;
        });


        // Clear expense form

        setExpenseForm({

            expenses_head: "",
            vendor_name: "",
            narration: "",
            payment_mode: "",
            qty: "",
            rate: "",
            amount: "",
        });


        // if (
        //     !expenseForm.expenses_head ||
        //     !expenseForm.vendor_name ||
        //     !expenseForm.narration ||
        //     !expenseForm.payment_mode ||
        //     !expenseForm.qty ||
        //     !expenseForm.rate ||
        //     !expenseForm.amount

        // ) {
        //     alert("Please fill all mandatory fields. expenses_head, vendor_name, narration, payment_mode, qty, rate, and amount are mandatory fields");
        //     return;
        // }
        // else {
            
        // }

        // const newRow = {
        //     id: Date.now(),
        //     ...expenseForm,
        // };

        // setExpenseRows((prev) => [...prev, newRow]);

        // // Clear form
        // setExpenseForm({
        //     expenses_head: "",
        //     vendor_name: "",
        //     narration: "",
        //     payment_mode: "",
        //     qty: "",
        //     rate: "",
        //     amount: "",
            
        // });
    };

    // Columns for Expenses Grid columns
    const ExpensesColumns = [
            {
                field: "expenses_head",
                headerName: "Expense Head",
                width: 180,
                editable: true,
                type: "text",
                // valueOptions: expenseHeads,
            },
            {
                field: "vendor_name",
                headerName: "Vendor Name",
                width: 250,
                editable: true,
                type: "text",
            },
            {
                field: "narration",
                headerName: "Narration",
                width: 200,
                editable: true,
                type: "text",
            },
            {
                field: "payment_mode",
                headerName: "Payment Mode",
                width: 120,
                editable: true,
                type: "text",
            },
            {
                field: "qty",
                headerName: "Quantity",
                width: 120,
                editable: true,
                type: "number",
            },
            {
                field: "rate",
                headerName: "Rate",
                width: 120,
                editable: true,
                type: "number",
            },
            {
                field: "amount",
                headerName: "Amount",
                width: 120,
                editable: true,
                type: "number",
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
                        // disabled={disableSubmit}
                    >
                        Delete
                    </Button>
                ),
            },
    ];

    // Delete row handler
    const handleDeleteExpense = (id) => {

        setExpenseRows((prevRows) => {

            const updatedRows =
                prevRows.filter(
                    (row) => row.id !== id
                );

            const total =
                calculateTotalExpense(
                    updatedRows
                );

            const approvedBudget =
                parseFloat(
                    formData.approved_budget
                ) || 0;


            setFormData((prevData) => ({
                ...prevData,

                actual_expense_total:
                    Number(total.toFixed(2)),

                balance_excess:
                    Number(
                        (
                            approvedBudget - total
                        ).toFixed(2)
                    ),
            }));


            return updatedRows;
        });


        // setExpenseRows((prevRows) =>
        //     prevRows.filter((row) => row.id !== id)
        // );
    };

    // Advance Amount Grid Columns
    const columnsAdvAmt = [
    {
        field: "event_request_no",
        headerName: "Request No.",
        width: 140,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      // type: "number",
      valueFormatter: (value) =>
        value?.toLocaleString("en-IN"),
    },
    
    {
      field: "paid_on",
      headerName: "Paid Date",
      width: 150,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-GB")
          : "",
    },
    {
      field: "mode",
      headerName: "Payment Mode",
      width: 150,
    },
    {
      field: "transaction_id",
      headerName: "Payment Remarks",
      width: 152,
      
    },
  ];

    // event Handler for form submit
    const handleSubmit = async (event) => {

    }
    return (
        <SectionCard title="">
            <Box component="form" onSubmit={handleSubmit}>
                {/* Settlements Information */}
                <fieldset>
                    <legend>Event Information</legend>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={3}>
                            {/* Proposa No */}
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    label="Proposal No."
                                    value={formData.proposal_no}
                                    onChange={handleFieldChange("proposal_no")}
                                    required
                                    onBlur={handleProposalNoBlur}
                                    error={ !formData.proposal_no}
                                    helperText={
                                        !formData.proposal_no
                                            ? "Proposal No. is required"
                                            : ""
                                    }
                                    // slotProps={{
                                    //     input: { readOnly: !subsettlement },
                                    // }}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.proposal_no ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.proposal_no ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>

                            {/* Event Name */}
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

                            {/* Unit */}
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
                        </Grid>
                        {/* Event Start, End Date and Event Duration */}
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
                            {/* Event Duration */}
                            <FormControl sx={formControl3rows} >
                                <TextField
                                    label="Event Duration"
                                    value={getDurationInDays()}
                                    placeholder="Event Duration"
                                    required
                                    // error={
                                    //     !formData.event_duration
                                    // }
                                    onChange={handleFieldChange("event_duration")}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            // color: formData.event_duration ? "blue" : "red",
                                            color: "blue",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            // color: formData.event_duration ? "blue" : "red",
                                            color: "blue",
                                        },
                                    }}
                                slotProps={{
                                    input: { readOnly: true },
                                }}

                                />
                            </FormControl>
                        </Grid>
                        {/* School Department and Header Name */}
                        <Grid container spacing={3}>
                            {/* School */}
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
                                        !formData.school_id
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
                        {/* Financial Year and Event Authorised Person */}
                        <Grid container spacing={3}>
                            {/* Financial Year Text Box */}
                            <FormControl sx={formControl3rows}>
                                <TextField
                                    label="Financial Year"
                                    placeholder="Auto populate Financial Year"
                                    id="txtFY"
                                    value={formData.financial_year}
                                    // slotProps={{
                                    //     input: { readOnly: true },
                                    // }}

                                    required
                                    error={
                                        !formData.financial_year
                                    }
                                    onChange={handleFieldChange("financial_year")}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.financial_year ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.financial_year ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>

                            {/* Event Authorised Person */}
                            <FormControl sx={formControl3rows}>
                                <TextField
                                    label="Event Authorised Person"
                                    placeholder="Event Authorised Person"
                                    id="txtEAP"
                                    value={formData.event_authorised_person}
                                    // slotProps={{
                                    //     input: { readOnly: true },
                                    // }}

                                    required
                                    error={
                                        !formData.event_authorised_person
                                    }
                                    onChange={handleFieldChange("event_authorised_person")}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: formData.event_authorised_person ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: formData.event_authorised_person ? "blue" : "red",
                                        },
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </LocalizationProvider>
                </fieldset>

                {/* Advance */}
                <fieldset>
                    <legend>Advance Amount Paid</legend>
                    <Box sx={{ height: 300, width: 745 }}>
                        <DataGrid
                            rows={rowsAdvAmt}
                            columns={columnsAdvAmt}
                            loading={loadingAdvAmt}
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
                                },

                                // Footer
                                "& .MuiDataGrid-footerContainer": {
                                    fontSize: "0.80rem",
                                },
                            }}

                        />
                        <Typography sx={{
                            textAlign: "left",
                            color: "#000",
                            fontWeight: "bold"
                        }}>
                            Total Advance : ₹ {totalAmount.toLocaleString()}
                        </Typography>
                    </Box>
                </fieldset>

                {/* Expenses */}
                <fieldset >
                    <legend>Expenses</legend>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box sx={{ height: 370, width: 1000 }}>
                            <DataGrid
                                rows={expenseRows}
                                columns={ExpensesColumns}
                                
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
                        <Grid container spacing={3}>
                            
                            {/* Expenses Head */}
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    label="Expenses Head"
                                    placeholder="Expenses Head"
                                    id="txtExpenseHead"
                                    type="text"
                                    required
                                    error={
                                        !expenseForm.expenses_head
                                    }
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

                            {/* Vendor Name */}
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    label="Vendor Name"
                                    placeholder="Vendor Name"
                                    id="txtVendorName"
                                    type="text"
                                    value={expenseForm.vendor_name}
                                    onChange={handleExpFieldChange("vendor_name")}
                                    required
                                    error={
                                        !expenseForm.vendor_name
                                    }
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: expenseForm.vendor_name ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: expenseForm.vendor_name ? "blue" : "red",
                                        },
                                    }}
                                // slotProps={{
                                //     input: { readOnly: true },
                                // }}
                                />
                            </FormControl>

                            {/* Narration */}
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                    label="Narration"
                                    placeholder="Narration"
                                    id="txtNarration"
                                    type="text"
                                    value={expenseForm.narration}
                                    onChange={handleExpFieldChange("narration")}
                                    required
                                    error={
                                        !expenseForm.narration
                                    }
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: expenseForm.narration ? "blue" : "red",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: expenseForm.narration ? "blue" : "red",
                                        },
                                    }}
                                // slotProps={{
                                //     input: { readOnly: true },
                                // }}
                                />
                            </FormControl>
                            
                        </Grid>
                        {/* Payment Mode, Quantity and Rate */}
                        <Grid container spacing={3}>
                            {/* Payment Mode */}
                            <FormControl required sx={formControl3rows} >
                                <InputLabel id="lblPaymentMode" sx={{
                                    color: expenseForm.payment_mode
                                        ? "blue"
                                        : "red",

                                    "&.Mui-focused": {
                                        color: expenseForm.payment_mode
                                            ? "blue"
                                            : "red",
                                    },
                                }}>Choose Payment Mode</InputLabel>
                                <Select
                                    labelId="lblPaymentMode"
                                    id="ddlPaymentMode"
                                    value={expenseForm.payment_mode}
                                    label="Choose Payment Mode"
                                    onChange={handleExpFieldChange("payment_mode")}
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
                                    {paymentmode.map((p) => (
                                        <MenuItem
                                            key={p.id}
                                            value={p.id}
                                        >
                                            {p.name}
                                        </MenuItem>
                                    ))}

                                </Select>
                            </FormControl>
                            {/* Quantity */}
                            <FormControl required sx={formControl3rows} >
                                <TextField
                                type="number"
                                label="Quantity"
                                value={
                                    expenseForm.qty
                                }
                                onChange={
                                    handleExpFieldChange(
                                        "qty"
                                    )
                                }
                                onWheel={(e) => e.target.blur()}
                                required
                                error={
                                    !expenseForm.qty
                                }
                                onKeyDown={(e) => {

                                    if (
                                        [
                                            "e",
                                            "E",
                                            "+",
                                            "-",
                                            "ArrowUp", "ArrowDown",
                                        ].includes(e.key)
                                    ) {

                                        e.preventDefault();
                                    }
                                }}
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
                            
                            {/* Rate */}
                            <FormControl
                                required
                                sx={formControl3rows}
                            >

                                <TextField
                                    type="number"
                                    label="Rate"
                                    value={
                                        expenseForm.rate
                                    }
                                    onChange={
                                        handleExpFieldChange(
                                            "rate"
                                        )
                                    }
                                    onWheel={(e) => e.target.blur()}
                                    required
                                    error={
                                        !expenseForm.rate
                                    }
                                    onKeyDown={(e) => {

                                        if (
                                            [
                                                "e",
                                                "E",
                                                "+",
                                                "-",
                                                "ArrowUp", "ArrowDown",
                                            ].includes(e.key)
                                        ) {

                                            e.preventDefault();
                                        }
                                    }}
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
                        </Grid>
                        {/* Amount */}
                        <Grid container spacing={3}>
                            {/* Amount */}
                            <FormControl
                                sx={formControl3rows}
                            >

                                <TextField
                                    type="text"
                                    label="Amount"
                                    value={
                                        expenseForm.amount
                                    }
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        },
                                    }}
                                    helperText={
                                        expenseForm.qty &&
                                            expenseForm.rate
                                            ? "Amount = Quantity × Rate"
                                            : ""
                                    }
                                />

                            </FormControl>
                        </Grid>
                        <Box sx={{ height: 70, width: 1000 }}>
                            <Button
                                variant="contained"
                                onClick={handleAddExpense}
                                sx={{ mb: 2 }}
                                // disabled={disableSubmit}
                            >
                                Add Expense
                            </Button>
                            



                        </Box>
                    </LocalizationProvider>

                </fieldset>

                {/* Office Report (To be filled by Account Departmrnt) */}
                <fieldset >
                    <legend>Office Report (To be filled by Account Departmrnt)</legend>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}></LocalizationProvider> */}
                    <Grid container spacing={3}>
                        {/* Total Collection */}
                        <FormControl required sx={formControl3rows} >
                            <TextField
                                type="number"
                                label="Total Collection"
                                value={
                                    formData.total_collection
                                }
                                onChange={
                                    handleFieldChange(
                                        "total_collection"
                                    )
                                }
                                onWheel={(e) => e.target.blur()}
                                required
                                error={
                                    !formData.total_collection
                                }
                                onKeyDown={(e) => {

                                    if (
                                        [
                                            "e",
                                            "E",
                                            "+",
                                            "-",
                                            "ArrowUp", "ArrowDown",
                                        ].includes(e.key)
                                    ) {

                                        e.preventDefault();
                                    }
                                }}
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

                        {/* Income Collection Details */}
                        <FormControl required sx={formControl3rows} >
                            <TextField
                                label="Income Collection Details"
                                placeholder="Income Collection Details"
                                id="txtIncomeCollectionDetails"
                                type="text"
                                value={formData.income_collection_details}
                                onChange={handleFieldChange("income_collection_details")}
                                multiline
                                rows={4}
                                required
                                error={
                                    !formData.income_collection_details
                                }
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        color: formData.income_collection_details ? "blue" : "red",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: formData.income_collection_details ? "blue" : "red",
                                    },
                                }}
                            // slotProps={{
                            //     input: { readOnly: true },
                            // }}
                            />
                        </FormControl>

                        {/* Report Prepared By */}
                        <FormControl required sx={formControl3rows} >
                            <TextField
                                label="Report Prepared By"
                                placeholder="Report Prepared By"
                                id="txtReportPreparedBy"
                                type="text"
                                value={formData.report_prepared_by}
                                onChange={handleFieldChange("report_prepared_by")}
                                
                                required
                                error={
                                    !formData.report_prepared_by
                                }
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        color: formData.report_prepared_by ? "blue" : "red",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: formData.report_prepared_by ? "blue" : "red",
                                    },
                                }}
                            // slotProps={{
                            //     input: { readOnly: true },
                            // }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Total Collection */}
                        <FormControl required sx={formControl3rows} >
                            <TextField
                                type="number"
                                label="Total Expenses"
                                value={
                                    formData.total_expenses
                                }
                                onChange={
                                    handleFieldChange(
                                        "total_expenses"
                                    )
                                }
                                onWheel={(e) => e.target.blur()}
                                required
                                error={
                                    !formData.total_expenses
                                }
                                onKeyDown={(e) => {

                                    if (
                                        [
                                            "e",
                                            "E",
                                            "+",
                                            "-",
                                            "ArrowUp", "ArrowDown",
                                        ].includes(e.key)
                                    ) {

                                        e.preventDefault();
                                    }
                                }}
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

                        {/* Report Checked and Verified By */}
                        <FormControl required sx={formControl3rows} >
                            <TextField
                                label="Report Checked and Verified By"
                                placeholder="Report Checked and Verified By"
                                id="txtReportPreparedBy"
                                type="text"
                                value={formData.report_checked_and_verified_by}
                                onChange={handleFieldChange("report_checked_and_verified_by")}
                                
                                required
                                error={
                                    !formData.report_checked_and_verified_by
                                }
                                sx={{
                                    "& .MuiInputLabel-root": {
                                        color: formData.report_checked_and_verified_by ? "blue" : "red",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: formData.report_checked_and_verified_by ? "blue" : "red",
                                    },
                                }}
                            // slotProps={{
                            //     input: { readOnly: true },
                            // }}
                            />
                        </FormControl>

                        {/* Amount Receivable/Payable by University */}
                        <FormControl required sx={formControl3rows} >
                            <TextField
                                type="number"
                                label="Amount Receivable/Payable by University"
                                value={
                                    formData.amount_receivable_payable_by_university
                                }
                                onChange={
                                    handleFieldChange(
                                        "formData.amount_receivable_payable_by_university"
                                    )
                                }
                                onWheel={(e) => e.target.blur()}
                                required
                                error={
                                    !formData.amount_receivable_payable_by_university
                                }
                                onKeyDown={(e) => {

                                    if (
                                        [
                                            "e",
                                            "E",
                                            "+",
                                            "-",
                                            "ArrowUp", "ArrowDown",
                                        ].includes(e.key)
                                    ) {

                                        e.preventDefault();
                                    }
                                }}
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
                    </Grid>

                </fieldset>

                {/* Submite and Clear Button */}
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
                        // disabled={proposalSubmitting || disableSubmit}
                    >
                        {/* {proposalSubmitting ? "Submitting..." : "Submit"} */}
                        Submit
                    </Button>

                    
                </Box>
                
            </Box>
                
        </SectionCard>
    );
}
