import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";

import { getfile } from "../services/file/file_download_Servoce";

export default function AttachmentList({ files = [] }) {

  const openFile = async (file) => {
    const response_file = await getfile(file.file_name);
    const path = response_file.downloadUrl.replace("//uploads", "/uploads");
    window.open(path, "_blank");
  };

  return (
    <Paper elevation={0.1} sx={{ p: 0.1 }}>

      <Typography>
        Attachments ({files.length})
      </Typography>

      <List>

        {files.map((file) => (

          <ListItem
            key={file.attachment_id}
            disablePadding
            primaryTypographyProps={{
    sx: {
      fontSize: "1px",
      fontWeight: 100,
      color: "#f21414",
    },
  }}
          >

            <ListItemButton
              onClick={() => openFile(file)}
            >

              {/* <ListItemIcon>
                <DescriptionIcon color="primary" />
              </ListItemIcon> */}

              <ListItemText
                
                primary={file.file_name}
                
                
              />

            </ListItemButton>

          </ListItem>

        ))}

      </List>

    </Paper>
  );
}