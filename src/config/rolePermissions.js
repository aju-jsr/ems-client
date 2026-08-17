// src/config/rolePermissions.js

export const ROLE_PERMISSIONS = {

    // Admin
    1: [
        "EVENT_CREATE",
        "EVENT_APPROVE_RM",
        "EVENT_APPROVE_FIN",
        "REPORT_VIEW",
        "REGISTER",
        "SETTLEMENT"
        // "REPORT_VIEW",
        // "USER_MANAGEMENT",
        // "ROLE_MANAGEMENT"
    ],

    // Requester
    2: [
        "EVENT_CREATE"
    ],

    // Approver
    3: [
        "EVENT_CREATE",
        "EVENT_APPROVE_RM"
    ],

    // Finance
    4: [
        "EVENT_CREATE",
        "EVENT_APPROVE_FIN",
        "REPORT_VIEW"
    ]

};