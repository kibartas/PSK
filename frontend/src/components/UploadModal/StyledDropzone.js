import { Grid, Input, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

export default function StyledDropzone({ onAdd, onRejection }) {
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop: onAdd, onDropRejected: onRejection, accept: 'video/*' })

  const className = useMemo(() => {
    let name = 'modal__dropzone';
    if (isDragAccept) {
      name += ' modal__dropzone--accept'; 
    }
    if (isDragReject) {
      name += ' modal__dropzone--reject';
    }

    return name;
  }, [
    isDragAccept,
    isDragReject
  ]);

  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Grid container {...getRootProps({ className })}>
        <Grid item xs={12}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Input {...getInputProps()} />
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant='h6'>Drag and drop videos here, or click to select them</Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <CloudUploadIcon fontSize='large'/>
        </Grid>
      </Grid>
    </>
  );
}
