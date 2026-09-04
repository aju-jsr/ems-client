import React, { useState, useEffect, useRef } from "react";
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
  clearFiles = false,
}) {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  // Clear files when parent changes clearFiles
  useEffect(() => {
    if (clearFiles) {
      setFiles([]);

      // Clear actual HTML file input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [clearFiles]);

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
          ref={inputRef}
          hidden
          multiple={multiple}
          type="file"
          accept={accept}
          onChange={handleChange}
        />
      </Button>

      <Stack
        direction="column"
        spacing={1}
        flexWrap="wrap"
      >
        {files.map((file, index) => (
          <Chip
            key={index}
            label={file.name}
            onDelete={() => removeFile(index)}
            sx={{
              justifyContent: "space-between",
              width: "100%",
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
}
