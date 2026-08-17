import React, { useState, useEffect } from "react";
import {
  Button,
  Chip,
  Stack,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function FileUpload({
  label = "Upload Files",
  multiple = true,
  accept = "*",
  onFilesChange,
//   required = true,
}) {
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(files);
    }
  }, [files, onFilesChange]);

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
      >
        {label}

        <input
          hidden
          multiple={multiple}
          type="file"
          accept={accept}
          onChange={handleChange}
        //   required={required}
        />
      </Button>

      <Stack direction="column" spacing={1} flexWrap="wrap">
        {files.map((file, index) => (
          <Chip
            key={index}
            label={file.name}
            onDelete={() => removeFile(index)}
            sx={{ justifyContent: "space-between",
                width: "100%", }}
          />
        ))}
      </Stack>
    </Stack>
  );
}