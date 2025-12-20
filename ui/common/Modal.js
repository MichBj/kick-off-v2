import { Modal as AntModal, Button } from 'antd';
import React, { useState } from 'react';
import theme from '@styles/theme';
import 'react-quill/dist/quill.core.css';

const Modal = ({ title, label, content, description }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button size="small" style={theme.palette.show} onClick={handleClickOpen}>
        {label}
      </Button>
      <AntModal
        title={title}
        open={open}
        onCancel={handleClose}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleClose} type="primary">
            CANCELAR
          </Button>,
        ]}
      >
        <div>
          <p>
            <b>{description}:</b>
          </p>
          <div
            className="view ql-editor"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </AntModal>
    </div>
  );
};

export default Modal;
