// components/FormComponent.js
import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Snackbar,
  Alert,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { DataContext } from "../context/DataContext";
import { centerOptions, visaOptions } from "../utils/optionsConfig";
const FormComponent = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    cName: "",
    ivacName: "",
    webId: "",
    visaType: "",
    name: "",
    phone: "",
    email: "",
  });

  const { addData } = useContext(DataContext);
  const [successMessage, setSuccessMessage] = useState(false);
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/store-form`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("Submitting form data:", formData);
    // Get selected center and visa details
    const selectedCenter = centerOptions[formData.cName];
    const selectedVisa = visaOptions[formData.visaType];

    if (!selectedCenter || !selectedVisa) {
      alert("Please select valid Center Name and Visa Type.");
      return;
    }
    const updatedRequestBody = {
      action: "sendOtp",
      resend: 0,
      info: [
        {
          web_id: formData.webId,
          web_id_repeat: formData.webId,
          passport: formData.passport || "",
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          amount: "800.00",
          captcha: formData.captcha || "",
          center: {
            id: selectedCenter.centerId,
            c_name: formData.cName,
            prefix: selectedCenter.prefix,
            is_delete: 0,
          },
          is_open: true,
          ivac: {
            id: selectedCenter.ivacId,
            center_info_id: selectedCenter.centerId,
            ivac_name: formData.cName,
            address: selectedCenter.address,
            prefix: selectedCenter.prefix,
            charge: 3,
            new_visa_fee: 800.0,
          },
          visa_type: {
            id: selectedVisa.visaTypeId,
            type_name: formData.visaType,
            order: selectedVisa.visaOrder,
            is_active: 1,
          },
          confirm_tos: true,
        },
      ],
    };

    try {
      // Make an API call to store the form data in the database
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRequestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form successfully stored in DB:", result);
        setSuccessMessage(true); // Show success message
      } else {
        const error = await response.json();
        console.error("Error storing form in DB:", error);
        alert("Failed to store form data. Please try again.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An unexpected error occurred. Please try again.");
    }

    // Reset form data after submission
    setFormData({
      cName: "",
      ivacName: "",
      webId: "",
      visaType: "",
      name: "",
      phone: "",
      email: "",
    });

    onClose(); // Close the modal
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="form-modal-title"
      aria-describedby="form-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography id="form-modal-title" variant="h6" component="h2">
            Carefully input webfile details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="cName">Center Name</InputLabel>
              <Select
                id="cName"
                name="cName"
                value={formData.cName}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select a High Commission</MenuItem>
                {Object.keys(centerOptions).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="ivacName">IVAC Name</InputLabel>
              <Select
                id="ivacName"
                name="ivacName"
                value={formData.ivacName}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select an IVAC Center</MenuItem>
                <MenuItem value="IVAC, RAJSHAHI">IVAC, RAJSHAHI</MenuItem>
                <MenuItem value="IVAC, KHULNA">IVAC, KHULNA</MenuItem>
                <MenuItem value="IVAC, SYLHET">IVAC, SYLHET</MenuItem>
                <MenuItem value="IVAC, CHITTAGONG">IVAC, CHITTAGONG</MenuItem>
                <MenuItem value="IVAC, Dhaka (JFP)">IVAC, Dhaka (JFP)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Web ID"
              name="webId"
              value={formData.webId}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="visaType">Visa Type</InputLabel>
              <Select
                id="visaType"
                name="visaType"
                value={formData.visaType}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select a Visa Type</MenuItem>
                {Object.keys(visaOptions).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleSubmit}
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>

        <Snackbar
          open={successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage(false)}
        >
          <Alert onClose={() => setSuccessMessage(false)} severity="success">
            Form added successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default FormComponent;
