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
        borderRadius: "6px 6px 0 0",
        px: 3,
        py: 2.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* University Logo */}
          <Box
            component="img"
            src={ajuLogo}
            alt="Arka Jain University"
            sx={{
              height: 60,
              width: 160,
              bgcolor: "#fff",
              borderRadius: 1,
              p: 0.5,
            }}
          />

          <Box sx={{ ml: 2 }}>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#fff",
                textAlign: "left",
              }}
            >
              {headerTitle}
              {/* Event Budget Proposal Form 1 */}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 15,
                fontWeight: 500,
                textAlign: "left",
              }}
            >
              Finance &amp; Accounts Department
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Welcome {login_name}
          </Typography>

          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.3,
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

