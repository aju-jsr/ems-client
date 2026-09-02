import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

// Import your logo
import ajuLogo from "../logo/aju-naac-logo-dark.png"; // Update the path as needed
import { useHeader } from "./HeaderContext";

export default function Header() {
  const login_name = localStorage.getItem("name");
  // const title = localStorage.getItem("titel");
  const { headerTitle } = useHeader();
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#004681",
        color: "#fff",
        borderRadius: { xs: 0, sm: "6px 6px 0 0" },
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1.5, md: 2.5 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "flex-start" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 0 },
            minWidth: 0,
          }}
        >
          {/* University Logo */}
          <Box
            component="img"
            src={ajuLogo}
            alt="Arka Jain University"
            sx={{
              height: { xs: 46, sm: 54, md: 60 },
              width: { xs: 124, sm: 146, md: 160 },
              bgcolor: "#fff",
              borderRadius: 1,
              p: 0.5,
            }}
          />

          <Box sx={{ ml: { xs: 0, sm: 2 }, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 20, sm: 24, md: 30 },
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#fff",
                textAlign: "left",
                overflowWrap: "anywhere",
              }}
            >
              {headerTitle}
              {/* Event Budget Proposal Form 1 */}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: { xs: 13, md: 15 },
                fontWeight: 500,
                textAlign: "left",
              }}
            >
              Finance &amp; Accounts Department
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: { xs: "left", sm: "right" }, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: 12, md: 14 },
              fontWeight: 500,
              overflowWrap: "anywhere",
            }}
          >
            Welcome {login_name}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 16, sm: 18, md: 22 },
              fontWeight: 700,
              lineHeight: 1.3,
              overflowWrap: "anywhere",
            }}
          >
            Expense Management System
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}


// import {
//   Box,
//   Paper,
//   Typography,
// } from "@mui/material";

// import ajuLogo from "../logo/aju-naac-logo-dark.png";

// export default function Header({ title, welcomeText }) {
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         bgcolor: "#004681",
//         color: "#fff",
//         borderRadius: "6px 6px 0 0",
//         px: 3,
//         py: 2.5,
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-start",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <Box
//             component="img"
//             src={ajuLogo}
//             alt="Arka Jain University"
//             sx={{
//               height: 60,
//               width: 160,
//               bgcolor: "#fff",
//               borderRadius: 1,
//               p: 0.5,
//             }}
//           />

//           <Box sx={{ ml: 2 }}>
//             <Typography
//               sx={{
//                 fontSize: 30,
//                 fontWeight: 700,
//                 lineHeight: 1.2,
//               }}
//             >
//               {title}
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 0.5,
//                 fontSize: 15,
//                 fontWeight: 500,
//               }}
//             >
//               Finance &amp; Accounts Department
//             </Typography>
//           </Box>
//         </Box>

//         <Box sx={{ textAlign: "right" }}>
//           <Typography
//             sx={{
//               fontSize: 14,
//               fontWeight: 500,
//             }}
//           >
//             {welcomeText}
//           </Typography>

//           <Typography
//             sx={{
//               fontSize: 22,
//               fontWeight: 700,
//             }}
//           >
//             Expense Management System
//           </Typography>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }
