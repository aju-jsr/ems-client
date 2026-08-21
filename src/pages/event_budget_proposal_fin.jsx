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
  Link
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

// Grid delete
// import EventBudgetGrid from "../components/EventBudgetGrid";

import '../styles/event.css';
import { formControl3rows, formControl2rows } from "../styles/commonStyles";

// Getting from Json file hard coded  1 Aug
// import employees from "../master_data/emp.json";

import React, { useState  } from 'react';
import { useRef } from "react";

import useUnits from "../hooks/useUnits";
// 2 Aug
import usePaymentMode from "../hooks/usePaymentMode";
// Load Attachment
import { getEventBudgetProposalsAttachment } from "../services/event_budget_proposals_attachment_Service";

// Load Attached files
import AttachmentList from "../components/AttachmentList"

// 1 aug
import useEmpolyees from "../hooks/useEmpolyee";
import useAccTypes from "../hooks/useAccType";
import useProposal from "../hooks/useProposal";
import useSchools from "../hooks/useSchool";
import useDept from "../hooks/useDept";
import useEventBudgetProposalsFinPatch from "../hooks/useEventBudgetProposalsFinPatch"
import Header from "../components/Header";
import useEventBudgetProposalsListForFinance from "../hooks/useEventBudgetProposalsListForFinance";
import { usePreviousMonthDisabled } from "@mui/x-date-pickers/internals";
// 4 Aug
import  useAdvAmount from "../hooks/useAdvAmount";
import useAdvAmountGet from "../hooks/useAdvAmountGet";

import { useHeader } from "../components/HeaderContext";

// Format Amount in thousand separator
import { formatIndianAmount } from "../utils/amountFormatter.js";


export default function EventInformation() {

  const { setHeaderTitle } = useHeader();
  setHeaderTitle("Budget Proposal - Finance");

  // Load Attachment
  const [showFileUpload, setShowFileUpload] = useState(true);
  const [showFileList, setshowFileList] = useState(false);
  const [filelist, setFileList] = useState([]);

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
    approvedamount:"",
    finapprovedamount:"",
    financeemarks:"",
    amtpaidbyfin:"",
    advancepaidon:null,
    paymentmode:"",
    transactionid:""
  });

  const [submittedJson, setSubmittedJson] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  // 1 Aug set Approve or Reject message
  const [isapproved, setisapproved] = useState(false);
  const [isrejeted, setisrejeted] = useState(false);
  // 4 Aug
  const [isadvamount, setisAdvamount] = useState(false);
  // const [advamtsection, setAdvAmtSection] = useState(false);
  const [proposalResponse, setProposalResponse] = useState(null);

  const [attachments, setAttachments] = useState([]);
  const [attachmentError, setAttachmentError] = useState(false);

  // 
  const [displaybtn, setDisplayBtn] = useState(true);

  const handleFiles = (files) => {
    setAttachments(files);
    setAttachmentError(files.length === 0);
    console.log("Selected Files:");
    files.forEach((file) => {
      console.log(file.name);
    });
  };

  
  const { units } = useUnits();
  // 2 Aug
  const { paymentmode } = usePaymentMode();
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

  const [reqId, setReqId] = useState("");
  const [statasId, setStatasId] = useState(0);

  const {
    loading: proposalSubmitting,
    error: proposalSubmitError,
    patchEventBudgetProposalFin,
  } = useEventBudgetProposalsFinPatch();

  // 4 Aug
  const {
    // loading: proposalSubmitting,
    // error: proposalSubmitError,
    submitAdvAmount,
  } = useAdvAmount();


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
    // setSubmitSuccess(false);
    let  s_id = 0;
    if (action === "approve") {
      // setStatasId(3);
      s_id = 7;
      console.log("Approve proposal");
    } else if (action === "reject") {
      // setStatasId(4);
      s_id = 6;
      console.log("Reject proposal");
    }

    const proposalJson = {

      request_id: reqId,
      status_id: s_id,
      approved_by: empId,
      // Note replace 1273 with user login emp id
      approved_amount: formData.finapprovedamount?.replace(/,/g, "") || 0,
      remarks: formData.financeemarks
    }

    const advAmtJson = {

      event_proposal_id: reqId,
      event_request_no: formData.requestNo,
      amount: formData.amtpaidbyfin?.replace(/,/g, "") || 0,
      paid_on: formatDate(formData.advancepaidon),
      mode: formData.paymentmode,
      transaction_id:formData.transactionid
    }

    
    try{
      if (action === "approve" || action === "reject"){
        const response = await patchEventBudgetProposalFin(proposalJson);
        setProposalResponse(response);
      }else if(action === "submit"){
        console.log("Submit Adv Amount");
        const response = await submitAdvAmount(advAmtJson);
        setProposalResponse(response);
        setisAdvamount(true);
        
      }
      // const response = await patchEventBudgetProposalFin(proposalJson);
      // setProposalResponse(response);
      if (action === "approve") {
        setisapproved(true);
        setisrejeted(false);
        setisAdvamount(false);
      } else if (action === "reject") {
        setisapproved(false);
        setisrejeted(true);
        setisAdvamount(false);
      }

      await AdvAmt_loadData();
      await loadData(); // Refresh the settlements list after successful submission
          
    } catch (error) {
      console.error(error);
      setSubmitSuccess(false);
    }

  };
  
  const [action, setAction] = useState("");

  const empId = JSON.parse(localStorage.getItem("user"))?.empId;

  const {
    rows,
    loading,
    loadData,
  } = useEventBudgetProposalsListForFinance(empId);
  // 0 is login emp id, need to pass runtime when login functionlaty created 

    // 4 Aug
  const {
    rowsAdvAmt,
    loadingAdvAmt,
    AdvAmt_loadData,
  } = useAdvAmountGet(reqId); 
  
  const totalAmount = rowsAdvAmt.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
);

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
  
  const onRowSelected = async (Selrow) => {
    
    setFormData(initialFormData);
    setisapproved(false);
    setisrejeted(false);

    const response = await getEventBudgetProposalsAttachment(Selrow.id);
    setShowFileUpload(false);
    setshowFileList(true);
    setFileList(response.data);

    const role = JSON.parse(localStorage.getItem("user"))?.role;
    let selected_status = "";
    
    rows.map((row) => {
      if(row.id === Selrow.id){
        // console.log(row);
          selected_status = row.status_name;
          setReqId(Selrow.id);
          setFormData((prev) => ({
          ...prev,
          requestNo: row.request_no,
          proposal: row.proposal_id,
          partyName: row.party_name,
          billDetails: row.bill_details,
          eventName: row.event_name,
          status: row.status_name,
          unit: row.unit_id,
          eventStartDate:  row.event_start_date
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
          advancePayment: formatIndianAmount(row.adv_payment),
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
          approverremarks: row.remarks === null ||
            row.remarks === undefined ||
            row.remarks === ""
              ? ""
              : row.remarks,
          
          // row.remarks,
          approvedamount:row.approved_amount === null ||
            row.approved_amount === undefined ||
            row.approved_amount === ""
              ? ""
              : formatIndianAmount(row.approved_amount),
          
          // fin Remarls
          financeemarks:row.fin_remarks === null ||
            row.fin_remarks === undefined ||
            row.fin_remarks === ""
              ? ""
              : row.fin_remarks,
          // fin Approved Amt
          finapprovedamount:row.fin_approved_amount === null ||
            row.fin_approved_amount === undefined ||
            row.fin_approved_amount === ""
              ? ""
              : formatIndianAmount(row.fin_approved_amount),

      }));


      }
        
    });

   

    if(role === 1 && (selected_status === 'Rejected by Finance' || selected_status === 'Approved by Finance'))
    {
      setDisplayBtn(true);
    }else if(selected_status === 'Approved by RM'){
      setDisplayBtn(true);
    }else if(role != 1 && (selected_status === 'Rejected by Finance' || selected_status === 'Approved by Finance')){
      setDisplayBtn(false);
    }
    

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


   const columnsAdvAmt = [
    {
        field: "event_request_no",
        headerName: "Request No.",
        width: 140,
    },
    {
        field: "req_emp_name",
        headerName: "Request Name",
        width: 250,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
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
      width: 120,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-GB")
          : "",
    },
    {
      field: "mode",
      headerName: "Mode",
      width: 100,
    },
    {
      field: "transaction_id",
      headerName: "Remarks",
      width: 165,
      // type: "number",
      // valueFormatter: (value) =>
      //   value?.toLocaleString("en-IN"),
    },
    
  ];

  return (
    
    
    <SectionCard title="">
      {/* <Header title="Budget Proposal" /> */}
      <Box component="form" onSubmit={handleSubmit}>
        {/* Proposal List */}
      <fieldset>
        <legend>Proposal List</legend>
          <Box sx={{ height: 410, width: 1000 }}>
            <DataGrid
              rows={rows}
              columns={columns}
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
                },

                // Footer
                "& .MuiDataGrid-footerContainer": {
                  fontSize: "0.80rem",
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
                  <InputLabel id="lblproposal">Choose Proposal For</InputLabel>
                  <Select
                    labelId="lblproposal"
                    id="ddlproposal"
                    value={formData.proposal}
                    label="Choose Proposal For"
                    slotProps={{
                        input: { readOnly: true },
                      }}
                    
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
                    />
                </FormControl>
                {/* Request No */}
                <FormControl sx={formControl3rows}>
                  <TextField
                    label="Request No"
                    value={formData.requestNo}
                    slotProps={{
                      input: { readOnly: true },
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
                        onChange={handleFieldChange("partyName")}
                        slotProps={{
                        input: { readOnly: true },
                      }}
                      />
                  </FormControl>
                  {/* Bills Details */}
                  <FormControl sx={formControl3rows}>
                    <TextField
                      label="Bills Details"
                      placeholder="Filled by Requester"
                      required
                      multiline
                      rows={5}
                      value={formData.billDetails}
                      onChange={handleFieldChange("billDetails")}
                      slotProps={{
                        input: { readOnly: true },
                      }}
                    />
                  </FormControl>
                  {/* <FormControl sx={formControl3rows}>
                    <FileUpload
                      label="Upload Bills"
                      multiple={true}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                      onFilesChange={handleFiles}
                      slotProps={{
                        input: { readOnly: true },
                      }}
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
                  </FormControl> */}

                <FormControl sx={formControl3rows}>
                  <AttachmentList files={filelist} />
                </FormControl>

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
                      value={formData.eventName}
                      onChange={handleFieldChange("eventName")}
                      slotProps={{
                        input: { readOnly: true },
                      }}
                    />
                </FormControl>
                
              
              </Grid>
              )}
              
              {/* 2nd Row Controls */}
              <Grid container spacing={3}>
                {/* Unit Drop down */}
                <FormControl sx={formControl3rows} >
                  <InputLabel id="lblUnit" required>Choose Unit</InputLabel>
                  <Select
                    labelId="lblUnit"
                    id="ddlUnit"
                    value={formData.unit}
                    required
                    label="Choose Unit"
                    onChange={handleFieldChange("unit")}
                    slotProps={{
                        input: { readOnly: true },
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
                      textField: { fullWidth: true, 
                         required: true,
                         readOnly: true
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
                    onChange={handleDateChange("eventEndDate")}
                    slotProps={{
                      textField: { fullWidth: true, 
                        required: true
                       }
                    }}
                  />
                </FormControl>
              </Grid>
              {/* 3rd Row Controls */}
              <Grid container spacing={3}>
                
                {/* School Drop down */}
                <FormControl sx={formControl3rows}>
                  <InputLabel id="lblSchool" required>Choose School</InputLabel>
                  <Select
                    labelId="lblSchool"
                    id="ddlSchool"
                    value={formData.schoolId}
                    required
                    label="Choose School"
                    slotProps={{
                        input: { readOnly: true },
                      }}
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
                  <InputLabel id="lbldept" required>Choose Department</InputLabel>
                  <Select
                    labelId="lbldept"
                    id="ddlDept"
                    value={formData.departmentId}
                    required
                    label="Choose Department"
                    slotProps={{
                        input: { readOnly: true },
                      }}
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
                  />
                </FormControl>
              </Grid>
              {/* 4th Row Controls */}
              <Grid container spacing={3}>
                {/* Employee Id Drop down */}
                <FormControl sx={formControl3rows}>
                  <InputLabel id="lblEmpId" required>Choose Employee Id</InputLabel>
                  <Select
                    labelId="lblEmpId"
                    id="ddlEmpId"
                    required
                    value={formData.employeeId}
                    label="Choose Employee Id"
                    slotProps={{
                        input: { readOnly: true },
                      }}
                    onChange={(e) => {
                      const empId = (e.target.value);
                      const empList = employees.filter(
                        (emp) => emp.emp_id === empId
                      );

                      setFormData((prevData) => ({
                        ...prevData,
                        employeeId: empId,
                        employeeName: empList[0]?.name || "",
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
                    {/* {departments.map((dept) => ( */}
                    {employees.map((emp) => (
                      <MenuItem
                        key={`${emp.emp_id}-${emp.emp_name}`}
                        value={emp.emp_id}
                      >
                        {emp.emp_id}
                      </MenuItem>
                    ))}
                    
                  </Select>
                </FormControl>     
                {/* Employee Name Text Box */}
                <FormControl sx={formControl3rows}>
                  <TextField
                    label="Name of Employee"
                    placeholder="Auto populate based on Employee Id"
                    id="txtEmp"
                    value={formData.employeeName}
                    slotProps={{
                        input: { readOnly: true },
                      }}
                    slotProps={{
                      input: { readOnly: true },
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
          <FormControl sx={formControl2rows}>
            <TextField
              label="Details"
              placeholder="Filled by Requester"
              multiline
              rows={5}
              value={formData.budgetDetails}
              slotProps={{
                        input: { readOnly: true },
                      }}
              onChange={handleFieldChange("budgetDetails")}
            />
          </FormControl>
          {/* Total Budget Amount */}
          <FormControl sx={formControl2rows}>
            <TextField
              type="text"
              label="Total Budget Amount"
              placeholder="Total Budget Amount"
              slotProps={{
                        input: { readOnly: true },
                      }}
              value={formData.totalBudgetAmount}
              onChange={handleAmountChange("totalBudgetAmount")}
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
              slotProps={{
                        input: { readOnly: true },
                      }}
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
                readOnly: true,
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
              slotProps={{
                        input: { readOnly: true },
                      }}
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
              slotProps={{
                        input: { readOnly: true },
                      }}
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
              slotProps={{
                        input: { readOnly: true },
                      }}
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
              slotProps={{
                        input: { readOnly: true },
                      }}
            />
          </FormControl>
          {/* BRANCH */}
          <FormControl sx={formControl3rows}>
            <TextField
              label="BRANCH"
              placeholder="BRANCH"
              value={formData.branch}
              onChange={handleFieldChange("branch")}
              slotProps={{
                        input: { readOnly: true },
                      }}
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
                    slotProps={{
                        input: { readOnly: true },
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

        </Grid>
      </fieldset>
      {/* Finance Section */}
      
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
                error={
                  !formData.financeemarks
                }
                sx={{
                  "& .MuiInputLabel-root": {
                    color: formData.financeemarks ? "blue" : "red",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: formData.financeemarks ? "blue" : "red",
                  },
                }}
                onChange={handleFieldChange("financeemarks")}

              />
          </FormControl>
          <FormControl sx={formControl2rows}>
              <TextField
                label="Approved Amount by Finance"
                placeholder="Approved Amount by Finance"
                type="text"
                value={formData.finapprovedamount}
                required
                error={
                  !formData.finapprovedamount
                }
                sx={{
                  "& .MuiInputLabel-root": {
                    color: formData.finapprovedamount ? "blue" : "red",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: formData.finapprovedamount ? "blue" : "red",
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
                onChange={handleAmountChange("finapprovedamount")}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "ArrowUp", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}

                onWheel={(e) => e.target.blur()}
                
              />
          </FormControl>

        </Grid>

        { formData.status === 'Approved by Finance' &&(
        <fieldset>
          <legend>Advance Amount Paid</legend>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* Advance Payment List */}
          <fieldset>
            <legend>Advance Payment List</legend>
              <Box sx={{ height: 300, width: 900 }}>
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

          <Grid container spacing={3}>
              <FormControl sx={formControl2rows}>
                <TextField
                  label="Amount Paid by Finance"
                  placeholder="Amount Paid by Finance"
                  type="text"
                  value={formData.amtpaidbyfin}
                  required
                  onChange={handleAmountChange("amtpaidbyfin")}
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

              <FormControl sx={formControl2rows}>
                <DatePicker
                  label="Advance Paid On"
                  format="DD-MM-YYYY"
                  value={formData.advancepaidon}
                  required
                  onChange={handleDateChange("advancepaidon")}
                  slotProps={{
                    // readOnly: true,
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />

                

              </FormControl>
          </Grid>
            <Grid container spacing={3}>
                <FormControl sx={formControl2rows} >
                  <InputLabel id="lblPaymentMode" required>Choose Payment Mode</InputLabel>
                  <Select
                    labelId="lblPaymentMode"
                    id="ddlPaymentMode"
                    value={formData.paymentmode}
                    required
                    label="Choose Payment Mode"
                    onChange={handleFieldChange("paymentmode")}

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

                <FormControl sx={formControl2rows}>
                  <TextField
                    label="Remarks/Transaction ID"
                    placeholder="Remarks/Transaction ID"
                    value={formData.transactionid}
                    required
                    onChange={handleFieldChange("transactionid")}

                  />
                </FormControl>
                {isadvamount && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <strong>Payment Saved Successfully.</strong>
                  </Alert>
                )}
            </Grid>
              {/* <Grid container spacing={3}> */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center", // Center horizontally
                    gap: 2,                   // Gap between buttons (16px)
                    mt: 3,                    // Top margin
                  }}
                >
                  
                  <Button variant="contained" type="submit" disabled={proposalSubmitting} onClick={() => setAction("submit")}>
                    {proposalSubmitting ? "Submitting..." : "Pay Advance"}
                  </Button>
                  
                </Box>
              {/* </Grid> */}
          </LocalizationProvider>
        </fieldset>
        )}

      </fieldset>
      
        {isapproved && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>Proposal Approved successfully.</strong>
          </Alert>
        )}
        
        {isrejeted && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <strong>Proposal Rejected.</strong>
          </Alert>
        )}
        
        
        {proposalSubmitError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to submit event budget proposal.
          </Alert>
        )}
        {/* New end */}

        {/* { !(formData.status === 'Approved by Finance') &&( */}
        { displaybtn &&(
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Center horizontally
              gap: 2,                   // Gap between buttons (16px)
              mt: 3,                    // Top margin
            }}
          >
            <Button variant="contained" type="submit" disabled={proposalSubmitting} onClick={() => setAction("approve")}>
              {proposalSubmitting ? "Submitting..." : "Approve"}
            </Button>
            <Button variant="contained" type="submit" disabled={proposalSubmitting} onClick={() => setAction("reject")}>
              {proposalSubmitting ? "Submitting..." : "Reject"}
            </Button>
          </Box>

        )}
        

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
