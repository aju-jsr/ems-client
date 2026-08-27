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


import SectionCard from "../components/SectionCard";
import FileUpload from "../components/FileUpload";
// Load Attached files
import AttachmentList from "../components/AttachmentList"


import '../styles/event.css';
import { formControl3rows, formControl2rows } from "../styles/commonStyles";

import MainLayout from '../components/MainLayout.jsx';

// Getting from Json file hard coded 1 Aug
// import employees from "../master_data/emp.json";

import React, { useEffect, useState  } from 'react';
import { useRef } from "react";

import useUnits from "../hooks/useUnits";
// 1 aug
import useEmpolyees from "../hooks/useEmpolyee";
import useAccTypes from "../hooks/useAccType";
import useProposal from "../hooks/useProposal";
import useSchools from "../hooks/useSchool";
import useDept from "../hooks/useDept";
import useEventBudgetProposals from "../hooks/useEventBudgetProposals";
// 5 Aug
import useAdvAmountGet from "../hooks/useAdvAmountGet";

// import Header from "../components/Header";
import { useHeader } from "../components/HeaderContext.jsx";

// Grid 2 Aug
// import useEventBudgetProposalsList from "../hooks/useEventBudgetProposalsList";
import useEventBudgetProposalsListForRequester from "../hooks/useEventBudgetProposalsListForRequester";
// Load Attachment
import { getEventBudgetProposalsAttachment } from "../services/event_budget_proposals_attachment_Service";

import SubmitSuccessPopup from "../components/SubmitSuccessPopup.jsx";

// Format Amount in thousand separator
import { formatIndianAmount } from "../utils/amountFormatter.js";

import {emailSend} from "../utils/emailSend.js"


export default function EventInformation() {
localStorage.setItem("titel", "Budget Proposal");
const { setHeaderTitle } = useHeader();
setHeaderTitle("Budget Proposal");

  const [formData, setFormData] = useState({
    requestNo: "EBP-",
    proposal:"",
    partyName:"",
    billDetails:"",
    eventName: "",
    status: "Draft",
    unit: "",
    eventStartDate: null,
    eventEndDate: null,
    schoolId: "",
    departmentId: "",
    headName: "",
    employeeId: JSON.parse(localStorage.getItem("user"))?.empId,
    employeeName: JSON.parse(localStorage.getItem("user"))?.name,
    financialYear: "",
    budgetDetails: "",
    totalBudgetAmount: "",
    advancePayment: "",
    advancePaymentDueDate: null,
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
    accountType: "",
    attachments: "",
    manager_id:"",
    approverremarks:"",
    approvedamount:"",
    finapprovedamount:"",
    financeemarks:""
  });

  const [submittedJson, setSubmittedJson] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [proposalResponse, setProposalResponse] = useState(null);

  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState(false);
  // Load Attachment
  const [showFileUpload, setShowFileUpload] = useState(true);
  const [showFileList, setshowFileList] = useState(false);
  const [filelist, setFileList] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  // for manager_id
  const [manager_id,setManagerId] = useState("");

  // 6 Aug
  const [approverSection, setApproverSection] = useState(false);


  const handleFiles = (files) => {
    setAttachments(files);
    setAttachmentError(files.length === 0);
    console.log("Selected Files:");
    files.forEach((file) => {
      console.log(file.name);
    });
  };

  
  const { units } = useUnits();
  // 1 aug
  const { employees} = useEmpolyees();
  const {  acctypes } = useAccTypes();
  const { proposal} = useProposal();
  
  const { schools } = useSchools();

  const {
    departments,
    loading: deptLoading,
    error: deptError,
  } = useDept(formData.schoolId);

  const {
    loading: proposalSubmitting,
    error: proposalSubmitError,
    submitEventBudgetProposal,
  } = useEventBudgetProposals();

  const handleFieldChange = (field) => (event) => {
    if(field === "proposal"){
      const proposal = Number(event.target.value);
      setFormData((prev) => ({
        ...prev,
        proposal,

        // Clear Proposal ===  2 is Bills controls when switching away from Bills
        partyName: proposal === 2 ? prev.partyName : null,
        billDetails: proposal === 2 ? prev.billDetails : null,

        attachments: proposal === 2 ? prev.attachments : setAttachments([]),
        // setAttachments([]);

        // Clear Advance controls when switching away from Advance
        eventName: proposal === 1 ? prev.advancePaymentDueDate : null,
        advancePaymentDueDate: proposal === 1 ? prev.advancePaymentDueDate : null,
        advancePayment: proposal === 1 ? prev.advancePayment : null,

        // 5 Aug Requested Emp name auto populate
        employeeName: JSON.parse(localStorage.getItem("user"))?.name,
        employeeId: JSON.parse(localStorage.getItem("user"))?.empId,
        
      }));
      // setAttachments([]);
    }else{
      setFormData((prevData) => ({
        ...prevData,
        [field]: event.target.value,
      }));
    }
    
  };

  const handleDateChange = (field) => (value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  //   Handle Amount Change with Indian Number Formatting
    const handleAmountChange = (field) => (e) => {
        const formattedValue = formatIndianAmount(e.target.value);

        setFormData((prev) => ({
            ...prev,
            [field]: formattedValue,
        }));        
    };

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

  const formatDate = (value) => value ? dayjs(value).format("YYYY-MM-DD") : "";

  const handleSubmit = async (event) => {

    event.preventDefault();
    setSubmitSuccess(false);
    setDisableSubmit(true);

    if (attachments.length === 0 && formData.proposal === 2) {
      setAttachmentError(true);
        alert("Please upload Bills (Attachments).");
        setDisableSubmit(false);
        return;
    }else{
      setAttachmentError(false);
    }

    // 5 Aug for date
    const today = dayjs().startOf("day");

    if (formData.eventStartDate.isBefore(today, "day") && 
          formData.proposal === 1) {
        alert("The Event Start Date cannot be earlier than today's date.");
        setDisableSubmit(false);
        return;
    }

    if (formData.eventEndDate.isBefore(today, "day") && 
          formData.proposal === 1) {
        alert("The Event End Date cannot be earlier than today's date.");
        setDisableSubmit(false);
        return;
    }

    
    if (formData.eventEndDate.isBefore(formData.eventStartDate, "day")) {
        alert("The Event End Date cannot be earlier than the Event Start Date. Please select a valid end date.");
        return;
    }
    

    const attachmentList = attachments.map((file, index) => ({
      sequence: index + 1,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }));

    const proposalJson = {

        proposal_id: formData.proposal,
        party_name: formData.partyName,
        bill_details: formData.billDetails,
        event_name: formData.eventName,
        status_id: 2,
        // status_id: formData.proposal === 1 ? 2 : 5,
        unit_id: formData.unit,
        event_start_date: formatDate(formData.eventStartDate),
        event_end_date: formatDate(formData.eventEndDate),
        school_id: formData.schoolId,
        department_id: formData.departmentId,
        name_of_head: formData.headName,
        req_emp_id: formData.employeeId,
        req_emp_name: formData.employeeName,
        financial_year: getFinancialYear(),
        details: formData.budgetDetails,
        budget_amount: formData.totalBudgetAmount?.replace(/,/g, "") || 0,
        adv_payment: 
          formData.advancePayment &&
          formData.advancePayment !== ""
            ? formData.advancePayment?.replace(/,/g, "") || 0
            : null,
        // adv_payment_due_date: formatDate(formData.advancePaymentDueDate),
        adv_payment_due_date:
          formData.advancePaymentDueDate &&
          formData.advancePaymentDueDate !== ""
            ? formatDate(formData.advancePaymentDueDate)
            : null,
        acc_holder_name: formData.accountHolderName,
        acc_number: formData.accountNumber,
        ifsc_code: formData.ifscCode,
        bank_name: formData.bankName,
        branch: formData.branch,
        // acc_type_id: formData.accountType
        acc_type_id: 
          formData.accountType &&
          formData.accountType !== ""
            ? formData.accountType
            : null,

        attachments: attachmentList,
        manager_id: JSON.parse(localStorage.getItem("user"))?.manager_id
        
    };

    const jsonText = JSON.stringify(proposalJson);
    setSubmittedJson(jsonText);


    try{
      const response = await submitEventBudgetProposal(proposalJson);
      console.log("API Response:", response);

      setProposalResponse(response);
      setSubmitSuccess(true);
    // Update Request No. on the form
      setFormData((prev) => ({
        ...prev,
        requestNo:
          response[0]?.request_no ||
          prev.requestNo,
      }));

      await loadData(); // Refresh the settlements list after successful submission

      // send email
      const manager = employees.find(
        (employee) => employee.emp_id === JSON.parse(localStorage.getItem("user"))?.manager_id
      );

      const req_emp = employees.find(
        (employee) => employee.emp_id === JSON.parse(localStorage.getItem("user"))?.empId
      );

      const managerEmail = manager?.email;
      const subject = `"Budget Proposal ${response[0]?.request_no} Created – Approval Required"`;
      const cc = [req_emp?.email].filter(Boolean);
      // const cc = ["rajnishkumarjsr@gmail.com"].filter(Boolean);

      await emailSend("PROPOSAL_CREATED", managerEmail, subject, formData.eventName, response[0]?.request_no, 
        JSON.parse(localStorage.getItem("user"))?.name, cc, null);
      
    } catch (error) {
      console.error(error);
      setSubmitSuccess(false);
    }

  };

  const empId = JSON.parse(localStorage.getItem("user"))?.empId;
  const {
    rows,
    loading,
    loadData,
  } = useEventBudgetProposalsListForRequester(empId);
  
  const onRowSelected = async (params) => {
    
    const response = await getEventBudgetProposalsAttachment(params.id);
    // setAttachments(response.data)
    setShowFileUpload(false);
    setshowFileList(true);
    setFileList(response.data);

    setDisableSubmit(true);

    rows.map((row) => {
      if (row.id === params.id) {
        setReqId(params.id);
        if(row.status_id === 3 || row.status_id === 4 || row.status_id === 6 || row.status_id === 7){
          setApproverSection(true);
        }else{
          setApproverSection(false);
        }

        setFormData((prev) => ({
          ...prev,
          requestNo: row.request_no,
          proposal: row.proposal_id,
          partyName: row.party_name,
          billDetails: row.bill_details,
          eventName: row.event_name,
          status: row.status_name,
          unit: row.unit_id,
          eventStartDate: row.event_start_date
            ? dayjs(row.event_start_date)
            : null,
          eventEndDate: row.event_end_date
            ? dayjs(row.event_start_date)
            : null,
          schoolId: row.school_id,
          departmentId: row.department_id,
          headName: row.name_of_head,
          employeeId: row.req_emp_id,
          employeeName: row.req_emp_name,
          financialYear: row.financial_year,
          budgetDetails: row.details,
          totalBudgetAmount: formatIndianAmount(row.budget_amount),
          advancePayment: row.adv_payment === null ||
            row.adv_payment === undefined ||
            row.adv_payment === ""
            ? ""
            :formatIndianAmount(row.adv_payment),
          advancePaymentDueDate: row.adv_payment_due_date
            ? dayjs(row.event_start_date)
            : null,
          accountHolderName: row.acc_holder_name,
          accountNumber: row.acc_number,
          ifscCode: row.ifsc_code,
          bankName: row.bank_name,
          branch: row.branch,
          accountType: row.acc_type_id === null ||
            row.acc_type_id === undefined ||
            row.acc_type_id === ""
            ? ""
            : row.acc_type_id,
          approvedamount: row.approved_amount  === null ||
            row.approved_amount === undefined ||
            row.approved_amount === ""
            ? ""
            : formatIndianAmount(row.approved_amount),
          approverremarks: row.remarks  === null ||
            row.remarks === undefined ||
            row.remarks === ""
            ? ""
            : row.remarks,

            finapprovedamount: row.fin_approved_amount  === null ||
            row.fin_approved_amount === undefined ||
            row.fin_approved_amount === ""
            ? ""
            : formatIndianAmount(row.fin_approved_amount),
          financeemarks: row.fin_remarks  === null ||
            row.fin_remarks === undefined ||
            row.fin_remarks === ""
            ? ""
            : row.fin_remarks,

        }));

        document.getElementById("eventInformation")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
      }

    });
  };

  const initialFormData = {
    requestNo: "EBP-",
    proposal:"",
    partyName:"",
    billDetails:"",
    eventName: "",
    status: "Draft",
    unit: "",
    eventStartDate: null,
    eventEndDate: null,
    schoolId: "",
    departmentId: "",
    headName: "",
    employeeId: "",
    employeeName: "",
    financialYear: "",
    budgetDetails: "",
    totalBudgetAmount: "",
    advancePayment: "",
    advancePaymentDueDate: null,
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
    accountType: "",
    attachments: "",
    approverremarks:"",
    approvedamount: "",
    finapprovedamount: "",
    financeemarks: ""
  };

  const handleClear = () => {
    setDisableSubmit(false);
    setFormData(initialFormData);
    setShowFileUpload(true);
    setshowFileList(false);
    setFileList([]);
    setAttachments([]);
    setApproverSection(false);

    // Clear any validation errors if applicable
    setAttachmentError(false);
    // setErrors({});
  };

  const columns = [
    {
    
        field: "request_no",
        headerName: "Request No.",
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

            setTimeout(() => {
              document.getElementById("eventInformation")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 100);

          }}
          // Scroll to Event Information section
        
      
          sx={{
            fontSize: "0.70rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          
        >
          {params.value}
        </Link>
        ),
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
      width: 130,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-GB")
          : "",
    },
    {
      field: "budget_amount",
      headerName: "Budget Amount",
      width: 100,
      renderHeader: () => (
        <div
          style={{
            whiteSpace: "normal",
            lineHeight: "16px",
            textAlign: "center",
          }}
        >
          Budget Amount
        </div>
      ),
      type: "number",
      // valueFormatter: (value) =>
      //   value?.toLocaleString("en-IN"),

      valueFormatter: (value) => {
        if (value === null || value === undefined || value === "") {
          return "";
        }

        const num = Number(String(value).replace(/,/g, ""));

        return Number.isNaN(num) ? value : num.toLocaleString("en-IN");
      },

    },
    {
      field: "adv_payment_due_date",
      headerName: "Payment Due Date",
      width: 100,
      renderHeader: () => (
        <div
          style={{
            whiteSpace: "normal",
            lineHeight: "16px",
            textAlign: "center",
          }}
        >
          Payment Due Date
        </div>
      ),
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

  // 5 Aug
  const [reqId, setReqId] = useState("");
  const {
      rowsAdvAmt,
      loadingAdvAmt,
    } = useAdvAmountGet(reqId); 

  const totalAmount = rowsAdvAmt.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );
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
       valueFormatter: (value) => {
        if (value === null || value === undefined || value === "") {
          return "";
        }

        const num = Number(String(value).replace(/,/g, ""));

        return Number.isNaN(num) ? value : num.toLocaleString("en-IN");
      },

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
      // type: "number",
      // valueFormatter: (value) =>
      //   value?.toLocaleString("en-IN"),
    },
    
  ];

  return (
    
    <SectionCard title="">
    {/* <MainLayout /> */}
     
      <Box component="form" onSubmit={handleSubmit}>
      {/* Proposal List */}
      <fieldset>
        <legend>Proposal List</legend>
          <Box sx={{ height: 370, width: 1000 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              onRowClick={onRowSelected}
              
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
                  fontSize: "0.70rem",
                },

                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#FFD54F",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                  fontSize: "0.70rem",
                },

                // Rows
                "& .MuiDataGrid-row": {
                  fontSize: "0.70rem",
                },

                // Cells
                "& .MuiDataGrid-cell": {
                  whiteSpace: "normal !important",
                  wordBreak: "break-word",
                  lineHeight: "1.5 !important",
                  display: "flex",
                  alignItems: "center",
                  py: 1,
                  fontSize: "0.70rem",
                },

                // Footer
                "& .MuiDataGrid-footerContainer": {
                  fontSize: "0.70rem",
                },
                "& .MuiDataGrid-row:hover": {
                    cursor: "pointer",
                },
              }}

            />
          </Box>
      </fieldset>
      {/* Event Information */}
      <section id="eventInformation"></section>
      <fieldset >
            <legend>Event Information</legend>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={3}>
                  {/* proposal Drop down */}
                <FormControl required sx={formControl3rows} >
                  <InputLabel id="lblproposal" sx={{
                    color: formData.proposal
                      ? "blue"
                      : "red",

                    "&.Mui-focused": {
                      color: formData.proposal
                        ? "blue"
                        : "red",
                    },
                  }}
                  >Choose Proposal For</InputLabel>
                  <Select
                    labelId="lblproposal"
                    id="ddlproposal"
                    value={formData.proposal}
                    label="Choose Proposal For"
                    required
                    error={
                      !formData.proposal
                    }
                    onChange={(e) => {
                      handleFieldChange("proposal")(e);
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
                    {proposal.map((pro) => (
                      <MenuItem
                        key={pro.proposal_id}
                        value={pro.proposal_id}
                      >
                        {pro.proposal_name}
                      </MenuItem>
                    ))}

                  </Select>
                </FormControl>
                  {/* Status */}
                <FormControl sx={formControl3rows}>
                  <TextField
                      label="Status"
                      value={formData.status}
                      slotProps={{
                        input: { readOnly: true },
                      }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: formData.status ? "blue" : "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: formData.status ? "blue" : "red",
                      },
                    }}
                    />
                </FormControl>
                <FormControl sx={formControl3rows}>
                  <TextField
                    label="Request No"
                    value={formData.requestNo}
                    slotProps={{
                      input: { readOnly: true },
                    }}
                      sx={{
                      "& .MuiInputLabel-root": {
                        color: formData.requestNo ? "blue" : "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: formData.requestNo ? "blue" : "red",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              {/* First Row Controls */}
              {Number(formData.proposal) === 2 &&( 
                <Grid id="grdBillsProposal"  container spacing={3}>
                  {/* Party Name */}
                  <FormControl sx={formControl3rows}>
                  <TextField
                    label="Party Name"
                    value={formData.partyName}
                    required
                    error={
                      !formData.partyName
                    }
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: formData.partyName ? "blue" : "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: formData.partyName ? "blue" : "red",
                      },
                    }}
                    onChange={handleFieldChange("partyName")}
                  />
                  </FormControl>
                  {/* Bills Details */}
                  <FormControl sx={formControl3rows}>
                    <TextField
                      label="Bills Details"
                      placeholder="Filled by Requester"
                      required
                    error={
                      !formData.billDetails
                    }
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: formData.billDetails ? "blue" : "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: formData.billDetails ? "blue" : "red",
                      },
                    }}
                      multiline
                      rows={5}
                      value={formData.billDetails}
                      onChange={handleFieldChange("billDetails")}
                    />
                  </FormControl>
                  {showFileUpload && (
                    <FormControl sx={formControl3rows}>
                      <FileUpload
                        label="Upload Bills"
                        multiple={true}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                        onFilesChange={handleFiles}
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
                  )}
                  {showFileList && (
                    <FormControl sx={formControl3rows}>
                      <AttachmentList files={filelist} />
                    </FormControl>
                  )}
                </Grid>
              )} 

              {Number(formData.proposal) === 1 &&(
              <Grid id="grdAdvProposal"   container spacing={3}>
                {/* Event Name */}
                <FormControl sx={formControl3rows}>
                  <TextField
                    label="Event Name"
                    placeholder="Filled by Requester"
                    required
                    error={
                      !formData.eventName
                    }
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: formData.eventName ? "blue" : "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: formData.eventName ? "blue" : "red",
                      },
                    }}
                    value={formData.eventName}
                    onChange={handleFieldChange("eventName")}

                  />
                </FormControl>
                
              
              </Grid>
              )}
              
              {/* 2nd Row Controls */}
              <Grid container spacing={3}>
                {/* Unit Drop down */}
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
                  }}
                  >Choose Unit</InputLabel>
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
                {/* Event Start Date */}
                <FormControl sx={formControl3rows}>
                  <DatePicker
                    label="Event Start Date"
                    format="DD-MM-YYYY"
                    value={formData.eventStartDate}
                    onChange={handleDateChange("eventStartDate")}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !formData.eventStartDate,
                        sx: {
                          "& .MuiInputLabel-root": {
                            color: formData.eventStartDate
                              ? "blue"
                              : "red",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: formData.eventStartDate
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
                    label="Event End Date"
                    format="DD-MM-YYYY"
                    value={formData.eventEndDate}
                    minDate={formData.event_start_date}
                    onChange={handleDateChange("eventEndDate")}
                    slotProps={{
                      textField: { 
                        fullWidth: true, 
                        required: true,
                        error: !formData.eventEndDate,
                        sx: {
                          "& .MuiInputLabel-root": {
                            color: formData.eventEndDate
                              ? "blue"
                              : "red",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: formData.eventEndDate
                              ? "blue"
                              : "red",
                          },
                        },
                        
                       }
                    }}
                  />
                </FormControl>
              </Grid>
              {/* 3rd Row Controls */}
              <Grid container spacing={3}>
                
                {/* School Drop down */}
                <FormControl required sx={formControl3rows}>
                  <InputLabel id="lblSchool" required sx={{
                    color: formData.schoolId
                      ? "blue"
                      : "red",

                    "&.Mui-focused": {
                      color: formData.schoolId
                        ? "blue"
                        : "red",
                    },
                  }}>Choose School</InputLabel>
                  <Select
                    labelId="lblSchool"
                    id="ddlSchool"
                    value={formData.schoolId}
                    required
                    error={
                      !formData.schoolId
                    }
                    label="Choose School"
                    onChange={(e) => {
                      const schoolId = Number(e.target.value);

                      setFormData((prevData) => ({
                        ...prevData,
                        schoolId,
                        departmentId: "",
                        headName: "",
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
                    color: formData.departmentId
                      ? "blue"
                      : "red",

                    "&.Mui-focused": {
                      color: formData.departmentId
                        ? "blue"
                        : "red",
                    },
                  }}>Choose Department</InputLabel>
                  <Select
                    labelId="lbldept"
                    id="ddlDept"
                    value={formData.departmentId}
                    required
                    error={
                      !formData.departmentId
                    }
                    label="Choose Department"
                    onChange={(e) => {
                      const deptId = Number(e.target.value);
                      const selectedDepartment = departments.find(
                        (dept) => dept.department_Id === deptId
                      );

                      setFormData((prevData) => ({
                        ...prevData,
                        departmentId: deptId,
                        headName: selectedDepartment?.department_head || "",
                      }));

                    }} 
                    disabled={!formData.schoolId || deptLoading}
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
                    value={formData.headName}
                    slotProps={{
                      input: { readOnly: true },
                    }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: formData.headName ? "blue" : "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: formData.headName ? "blue" : "red",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
              {/* 4th Row Controls */}
              <Grid container spacing={3}>
                {/* Employee Id Drop down */}
                <FormControl sx={formControl3rows}>
                  {/* <InputLabel id="lblEmpId" required>Choose Employee Id</InputLabel> */}
                  <TextField
                    label="Requester Emp ID"
                    placeholder="Auto Employee Id"
                    id="txtEmpId"
                    value={formData.employeeId}
                    slotProps={{
                      input: { readOnly: true },
                    }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: formData.employeeId ? "blue" : "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: formData.employeeId ? "blue" : "red",
                      },
                    }}
                  />
                  {/* <Autocomplete
                    options={employees}
                    getOptionLabel={(option) => option.emp_id.toString()}
                    value={
                      employees.find(
                        (emp) => emp.emp_id === formData.employeeId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        employeeId: newValue?.emp_id || "",
                        employeeName: newValue?.emp_name || "",
                        manager_id: newValue?.manager_id || "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Employee ID"
                        required
                      />
                    )}
                  /> */}

                </FormControl>     
                {/* Employee Name Text Box */}
                <FormControl sx={formControl3rows}>
                  <TextField
                    label="Requester Name"
                    placeholder="Auto populate based on Employee Id"
                    id="txtEmp"
                    value={formData.employeeName}
                    slotProps={{
                      input: { readOnly: true },
                    }}
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: formData.employeeName ? "blue" : "red",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: formData.employeeName ? "blue" : "red",
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
      {/* Estimated Budget */}
      <fieldset>
        <legend>Estimated Budget</legend>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* First Row Controls */}
        
        <Grid container spacing={3}>
          {/* Details */}
          <FormControl required sx={formControl2rows}>
                <TextField
                  label="Details"
                  placeholder="Filled by Requester"
                  multiline
                  rows={5}
                  value={formData.budgetDetails}
                  onChange={handleFieldChange("budgetDetails")}
                  required
                  error={
                    !formData.budgetDetails
                  }
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: formData.budgetDetails ? "blue" : "red",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: formData.budgetDetails ? "blue" : "red",
                    },
                  }}
                />
          </FormControl>
          {/* Total Budget Amount */}
          <FormControl sx={formControl2rows}>
            <TextField
              type="text"
              label="Total Budget Amount"
              placeholder="Total Budget Amount"
              required
              error={
                !formData.totalBudgetAmount
              }
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: formData.totalBudgetAmount ? "blue" : "red",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: formData.totalBudgetAmount ? "blue" : "red",
                    },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
              value={formData.totalBudgetAmount}
              onChange={handleAmountChange("totalBudgetAmount")}
                  onKeyDown={(e) => {
                    if (
                      [
                        "e",
                        "E",
                        "+",
                        "-",
                        "ArrowUp",
                        "ArrowDown",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}

              onWheel={(e) => e.target.blur()}
              
            />
          </FormControl>
        </Grid>
        
        {/* 2nd Row Controls */}
        {Number(formData.proposal) === 1 &&(
        <Grid container spacing={3}>
          {/* Advance Payment */}
          <FormControl sx={formControl2rows}>
            <TextField
              type="text"
              label="Advance Payment"
              placeholder="Advance Payment"
              value={formData.advancePayment}
              onChange={handleAmountChange("advancePayment")}
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
          {/* Adv Payment Due Date */}
          <FormControl sx={formControl2rows}>
            <DatePicker
              label="Adv Payment Due Date"
              format="DD-MM-YYYY"
              value={formData.advancePaymentDueDate}
              onChange={handleDateChange("advancePaymentDueDate")}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
            
          </FormControl>

        </Grid>
        )}


        <h5>BANK DETAILS OF PARTY TO WHOM PAYMENT HAS TO BE MADE</h5>
         {/* 3rd Row Controls */}
        <Grid container spacing={3}>
          {/* ACCOUNT HOLDER NAME */}
          <FormControl sx={formControl3rows}>
            <TextField
              label="ACCOUNT HOLDER NAME"
              placeholder="ACCOUNT HOLDER NAME"
              value={formData.accountHolderName}
              onChange={handleFieldChange("accountHolderName")}
            />
          </FormControl>
          {/* ACCOUNT NUMBER */}
          <FormControl sx={formControl3rows}>
            <TextField
              type="number" 
              label="ACCOUNT NUMBER"
              placeholder="ACCOUNT NUMBER"
              value={formData.accountNumber}
              onChange={handleFieldChange("accountNumber")}
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
              value={formData.ifscCode}
              onChange={handleFieldChange("ifscCode")}
            />
          </FormControl>

        </Grid>

        {/* 4th Row Controls */}
        <Grid container spacing={3}>
          {/* BANK NAME */}
          <FormControl sx={formControl3rows}>
            <TextField
              label="BANK NAME"
              placeholder="BANK NAME  "
              value={formData.bankName}
              onChange={handleFieldChange("bankName")}
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
                    value={formData.accountType}
                    label="Choose Account Type"
                    onChange={handleFieldChange("accountType")}
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
        
        </LocalizationProvider>
      </fieldset>
      {/* Approver Section */}
      { 
        approverSection  &&(
          <fieldset>
                  <legend>Approver Section</legend>
                  <Grid container spacing={3}>
                    {/* Approver Remarks */}
                    <FormControl sx={formControl2rows}>
                      <TextField
                        label="Approver Remarks"
                        placeholder="Approver Remarks"
                        value={formData.approverremarks}
                        multiline
                        rows={2}
                        required
                        onChange={handleFieldChange("approverremarks")}
                        slotProps={{
                                  input: { readOnly: true },
                                }}
                        
                      />
                    </FormControl>
                    <FormControl sx={formControl2rows}>
                      <TextField
                        label="Approved Amount"
                        placeholder="Approver Amount"
                        type="text"
                        value={formData.approvedamount}
                        required
                        onChange={handleAmountChange("approvedamount")}
                        slotProps={{
                                  input: { readOnly: true },
                                }}
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
          
                  </Grid>
                </fieldset>
      )}

      {/* Finance Approver Section */}
      { 
        approverSection  &&(
          <fieldset>
                  <legend>Finance Section</legend>
                          <Grid container spacing={3}>
                            {/* Finance Remarks */}
                            <FormControl sx={formControl2rows}>
                              <TextField
                                label="Finance Remarks"
                                placeholder="Finance Remarks"
                                value={formData.financeemarks}
                                multiline
                                rows={2}
                                required
                                onChange={handleFieldChange("financeemarks")}
                                slotProps={{
                                  input: { readOnly: true },
                                }}
                                
                              />
                            </FormControl>
                            <FormControl sx={formControl2rows}>
                              <TextField
                                label="Approved Amount by Finance"
                                placeholder="Approved Amount by Finance"
                                type="text"
                                value={formData.finapprovedamount}
                                required
                                onChange={handleAmountChange("finapprovedamount")}
                                onKeyDown={(e) => {
                                  if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                slotProps={{
                                  input: { readOnly: true },
                                }}
                              />
                            </FormControl>
                  
                          </Grid>
                </fieldset>
      )}

      {/* Advance Amount Paid */}
      { formData.status === 'Approved by Finance' &&(
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
                    fontSize: "0.70rem",
                  },

                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#FFD54F",
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                    fontSize: "0.70rem",
                  },

                  // Rows
                  "& .MuiDataGrid-row": {
                    fontSize: "0.70rem",
                  },

                  // Cells
                  "& .MuiDataGrid-cell": {
                    whiteSpace: "normal !important",
                    wordBreak: "break-word",
                    lineHeight: "1.5 !important",
                    display: "flex",
                    alignItems: "center",
                    py: 1,
                    fontSize: "0.70rem",
                  },

                  // Footer
                  "& .MuiDataGrid-footerContainer": {
                    fontSize: "0.70rem",
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
      )}

      {/* {submitSuccess && (
          <SubmitSuccessPopup
            requestNo={proposalResponse[0]?.request_no}
            onClose={() => setSubmitSuccess(false)}
          />
        )} */}
        
        {submitSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>Event budget proposal submitted successfully.</strong>

            <br />

            Request No.:{" "}
            { proposalResponse[0]?.request_no }
            
          </Alert>

        )}

        

        
        {proposalSubmitError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to submit event budget proposal.
          </Alert>
        )}
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
            disabled={proposalSubmitting || disableSubmit}
          >
            {proposalSubmitting ? "Submitting..." : "Submit"}
          </Button>

          <Button
            variant="contained"
            type="button"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Box>
        

        {submittedJson && (
          <Box
            component="pre"
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: 1,
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
          </Box>
        )}
      </Box>
      

    </SectionCard>

    
    
  );
}
