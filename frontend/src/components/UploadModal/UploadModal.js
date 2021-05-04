import React from 'react';
import { Modal, Fade, Backdrop } from '@material-ui/core';

export default function UploadModal({ show, onClose }) {

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={show}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={show}>
        <p>Nothing here yet...</p>
      </Fade>
    </Modal>
  );
}