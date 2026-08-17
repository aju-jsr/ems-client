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

//  for Excel Import
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


import SectionCard from "../../components/SectionCard.jsx";

import '../../styles/event.css';
import { formControl3rows, formControl2rows, formControl4rows } from "../../styles/commonStyles";

import MainLayout from '../../components/MainLayout.jsx';

import { useHeader } from "../../components/HeaderContext.jsx";

import React, { useEffect, useState  } from 'react';
import { useRef } from "react";

// Get Employees
import useEmpolyees from "../../hooks/useEmpolyee";
// Get Schools
import useSchools from "../../hooks/useSchool";
// Get Department
import useDept from "../../hooks/useDept";
// Get Report Data
import useSettlementReport from "../../hooks/reports/useSettlementReport.js";
// Get Unit
import useUnits from "../../hooks/useUnits";


export default function Report() {
    const { setHeaderTitle } = useHeader();
    setHeaderTitle("Settlement Report");

    const [submitSuccess, setSubmitSuccess] = useState(false);

    // to hold report data
    const [report, setReport] = useState([]);

    // Get Employees
    const { employees} = useEmpolyees();
    // Get Schools
    const { schools } = useSchools();
    // Get Department
    const {
        departments,
        loading: deptLoading,
        error: deptError,
    } = useDept(-1);

    // Get Unit
    const { units } = useUnits();

    const [formData, setFormData] = useState({
        settlementNo: "",
        proposal:"",
        partyName:"",
        billDetails:"",
        eventName: "",
        status: "Draft",
        unit: "",
        eventStartDate: null,
        eventEndDate: null,
        schoolId: "",
        schoolName:"",
        departmentId: "",
        departmentName: "",
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
        manager_id:"",
        approverremarks:"",
        approvedamount:"",
        finapprovedamount:"",
        financeemarks:""
    });

    const {
        
        loading: reportSubmitting,
        error: reportSubmitError,
        submitSettlementReport,
    } = useSettlementReport();
 

    // Requested Proposal List Grid columns
    const proposalColumns = [
            
            {
                field: "settlement_no",
                headerName: "Settlement No",
                width: 100,
            },
            {
                field: "sub_settlement_no",
                headerName: "Sub",
                width: 50,
            },
            {
                field: "event_name",
                headerName: "Event Name",
                width: 100,
            },
            {
                field: "FY",
                headerName: "FY",
                width: 80,
            },
            {
                field: "unit_name",
                headerName: "Unit",
                width: 250,
            },
            {
                field: "school_name",
                headerName: "School",
                width: 250,
            },
            {
                field: "department_name",
                headerName: "Department",
                width: 250,
            },
            {
                field: "req_emp_name",
                headerName: "Requestor Name",
                width: 200,
            },
            {
                field: "approved_amount",
                headerName: "Approved Amount",
                width: 130,
            },
            {
                field: "payment",
                headerName: "Payment",
                width: 100,
            },
            {
                field: "status_name",
                headerName: "Status",
                width: 120,
            },
            
    ];

    // Format Proposal Numbet
    const formatsettlementNo = (value) => {
        if (!value) return null;

        const settlementNo = value.toString().trim().toUpperCase();

        return settlementNo.startsWith("ESN-")
            ? settlementNo
            : `ESN-${settlementNo}`;
    };

    const handleSubmit = async (event) => {
        // formData.settlementNo = formData.settlementNo
        const settlementJson = {
            
            school_id: formData.schoolId === "" || formData.schoolId === undefined
                ? null
                : formData.schoolId,

            dept_id: formData.departmentId === "" || formData.departmentId === undefined
                ? null
                : formData.departmentId,

            emp_id: formData.employeeId === "" || formData.employeeId === undefined
                ? null
                : formData.employeeId,
            unit_id:formData.unit_id === "" || formData.unit_id === undefined
                ? null
                : formData.unit_id,
            settlement_no:formData.settlementNo === "" || formData.settlementNo === undefined
                ? null
                : formatsettlementNo(formData.settlementNo),
            financialYear:formData.financialYear === "" || formData.financialYear === undefined
                ? null
                : formData.financialYear,
            

        }

        try{
             const response = await submitSettlementReport(settlementJson);
             setSubmitSuccess(true);
             setReport(response);
             handleClear();
           
        }catch (error) {
            console.error(error);
            setSubmitSuccess(false);
        }
    }

    const exportToExcel = () => {
    // Convert DataGrid rows to Excel data
        const excelData = report.map((row) => ({
            "Settlement No": row.settlement_no,
            "sub": row.sub_settlement_no,
            "Event Name": row.event_name,
            "FY": row.FY,
            "Unit":row.unit_name,
            "School":row.school_name,
            "Department": row.department_name,
            // "Employee ID": row.req_emp_id,
            "Employee Name": row.req_emp_name,
            "Approved Amount": row.approved_amount,
            "Payment": row.payment,
            "Status": row.status_name,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    // Save file
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Settlement_Report.xlsx");
    };

    const handleFieldChange = (field) => (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    }

    const handleClear = () => {
    setFormData(prev => ({
        ...prev,
        employeeId:"",
        employeeName:"",
        settlementNo: "",
        financialYear:"",
        schoolId:"",
        departmentId:""


    }));
};

    // Get Current Financial Year
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

    return (
        <SectionCard title="" onSubmit={handleSubmit}>
            <Box component="form">
                <fieldset>
                    <legend>Filters</legend>
                    <Box sx={{ height: 100, width: 1000 }}>
                        <FormControl sx={formControl3rows}>
                            <Autocomplete
                                options={employees}
                                getOptionLabel={(option) => option.emp_name.toString()}
                                value={
                                employees.find(
                                    (emp) => emp.emp_name === formData.employeeName
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
                                    label="Employee Name"
                                    
                                />
                                )}
                            />
                        </FormControl>
                        <FormControl sx={formControl3rows}>
                            <Autocomplete
                                options={schools}
                                getOptionLabel={(option) => option.school_name.toString()}
                                value={
                                employees.find(
                                    (sch) => sch.school_name === formData.schoolName
                                ) || null
                                }
                                onChange={(event, newValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    schoolId: newValue?.school_Id || "",
                                    schoolName: newValue?.school_name || ""
                                }));
                                }}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="School Name"
                                    
                                />
                                )}
                            />
                        </FormControl>
                        <FormControl sx={formControl3rows}>
                            <Autocomplete
                                options={departments}
                                getOptionLabel={(option) => option.department_name.toString()}
                                value={
                                employees.find(
                                    (dept) => dept.department_name === formData.departmentName
                                ) || null
                                }
                                onChange={(event, newValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    departmentId: newValue?.department_Id || "",
                                    departmentName: newValue?.department_name || ""
                                }));
                                }}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Department Name"
                                    
                                />
                                )}
                            />
                        </FormControl>
                       
                    </Box>
                    <Box sx={{ height: 120, width: 1000 }}>
                        <FormControl sx={formControl3rows}>
                            <Autocomplete
                                options={units}
                                getOptionLabel={(option) => option.unit_name.toString()}
                                value={
                                units.find(
                                    (emp) => emp.unit_name === formData.employeeName
                                ) || null
                                }
                                onChange={(event, newValue) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    unit_id: newValue?.unit_id || "",
                                    unit_name: newValue?.unit_name || "",
                                }));
                                }}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Unit"
                                    
                                />
                                )}
                            />
                        </FormControl>

                        <FormControl sx={formControl3rows}>
                            <TextField
                                label="financial Year"
                                value={formData.financialYear}
                                type="text"
                                onChange={handleFieldChange("financialYear")}
                                placeholder="2026-27"
                            />
                        </FormControl>
                        <FormControl sx={formControl3rows}>
                            <TextField
                                label="Settlement No"
                                value={formData.settlementNo}
                                type="text"
                                onChange={handleFieldChange("settlementNo")}
                                placeholder="ESN-0001"
                            />
                        </FormControl>

                        {/* Button Submit */}
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
                                disabled={reportSubmitting}
                                onClick={handleSubmit}
                            >
                                {reportSubmitting ? "Submitting..." : "Submit"}
                            </Button>

                            {/* <Button
                                variant="contained"
                                type="button"
                                onClick={handleClear}
                            >
                                Clear
                            </Button> */}
                        </Box>

                    </Box>
                </fieldset>

                <fieldset>
                    <legend>Proposal List</legend>
                    <Box sx={{ height: 370, width: 1000 }}>
                        <DataGrid
                            rows={report}
                            columns={proposalColumns}
                            loading={reportSubmitting}
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
                                    fontSize: "0.60rem",
                                },

                                "& .MuiDataGrid-columnHeader": {
                                    backgroundColor: "#FFD54F",
                                },

                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontWeight: "bold",
                                    fontSize: "0.60rem",
                                    whiteSpace: "normal",
                                    lineHeight: "1.0",
                                    textAlign: "center",
                                },

                                // Rows
                                "& .MuiDataGrid-row": {
                                    fontSize: "0.60rem",
                                },

                                // Cells
                                "& .MuiDataGrid-cell": {
                                    whiteSpace: "normal !important",
                                    wordBreak: "break-word",
                                    lineHeight: "1.5 !important",
                                    display: "flex",
                                    alignItems: "center",
                                    py: 1,
                                    fontSize: "0.60rem",
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",

                                },

                                // Footer
                                "& .MuiDataGrid-footerContainer": {
                                    fontSize: "0.80rem",
                                },
                            }}

                        />

                        <Button
                            variant="contained"
                            onClick={exportToExcel}
                            >
                            Export to Excel
                        </Button>
                    </Box>
                    
                </fieldset>
            </Box>
        </SectionCard>
    );
}