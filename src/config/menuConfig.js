import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

export const menuConfig = [

    // {
    //     label: "Dashboard",
    //     icon: DashboardIcon,
    //     path: "/dashboard"
    // },

    {
        label: "Budget Proposal",

        children: [

            {
                label: "Create Proposal",
                icon: ReceiptIcon,
                permission: "EVENT_CREATE",
                path: "/event_budget_proposal"
            },

            {
                label: "RM Approval",
                icon: FactCheckIcon,
                permission: "EVENT_APPROVE_RM",
                path: "/event_budget_proposal_rm"
            },

            {
                label: "Finance Approval",
                icon: PaymentsIcon,
                permission: "EVENT_APPROVE_FIN",
                path: "/event_budget_proposal_fin"
            }

        ]

    },

    {
        label: "Settlement",
         children: [
            {
                label: "Create Settlement",
                icon: ReceiptIcon,
                permission: "EVENT_CREATE",
                path: "/settlements"
            },
            {
                label: "RM Approval",
                icon: FactCheckIcon,
                permission: "EVENT_APPROVE_RM",
                path: "/settlements_rm"
            },

            {
                label: "Finance Approval",
                icon: PaymentsIcon,
                permission: "EVENT_APPROVE_FIN",
                path: "/settlements_fin"
            }
        ]
        // icon: AccountBalanceWalletIcon,
        // permission: "SETTLEMENT",
        // path: "/settlement"
    },

    {
        label: "Reports",
        children: [
            {
                label: "BUDGET PROPOSAL",
                icon: AssessmentIcon,
                permission: "REPORT_VIEW",
                path: "/budget_proposal_report"
            },
            {
                label: "SETTLEMENT",
                icon: AssessmentIcon,
                permission: "REPORT_VIEW",
                path: "/settlement_report"
            }
        ]
       
        // icon: AssessmentIcon,
        // permission: "REPORT_VIEW",
        // path: "/reports"
    },
    {
        label: "Admin",
        children: [
            {
                label: "Registration",
                icon: AssessmentIcon,
                permission: "REGISTER",
                path: "/register"
            },
            {
                label: "Update User",
                icon: AssessmentIcon,
                permission: "REGISTER",
                path: "/user_update"
            }
        ]
       
        // icon: AppRegistrationIcon,
        // permission: "REGISTER",
        // path: "/register"
    },

    
    {
        label: "Logout",
        icon: LogoutIcon,
        action: "logout"
    }

];