// components/form.js
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
import {
  centerOptions,
  visaOptions,
  highcom,
  ivacOptions,
} from "../utils/optionsConfig";

const FormComponent = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    cName: "",
    ivacName: "",
    webId: "",
    visaType: "",
    name: "",
    phone: "",
    email: "",
    familyCount: 0,
    visaPurpose: "",
    familyMembers: [],
  });

  const { addData } = useContext(DataContext);
  const [successMessage, setSuccessMessage] = useState(false);
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/store-application`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "familyCount") {
      const count = parseInt(value, 10);
      const newFamilyMembers =
        count > 0
          ? Array.from(
              { length: count },
              (_, i) =>
                formData.familyMembers[i] || { familyName: "", familyWebId: "" }
            )
          : [];
      setFormData((prev) => ({
        ...prev,
        [name]: count,
        familyMembers: newFamilyMembers,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle changes for family members inputs
  const handleFamilyMemberChange = (index, field, value) => {
    const updatedFamilyMembers = [...formData.familyMembers];
    updatedFamilyMembers[index] = {
      ...updatedFamilyMembers[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      familyMembers: updatedFamilyMembers,
    }));
  };

  const handleSubmit = async () => {
    // Build the payload using the configuration mappings.
    // For IVAC, we use the ivacOptions mapping to get the corresponding IVAC ID.
    const payload = {
      highcom: String(highcom[formData.cName] || formData.cName || ""),
      // Store the IVAC ID instead of the IVAC name.
      ivacName: String(
        ivacOptions[formData.ivacName] || formData.ivacName || ""
      ),
      webId: String(formData.webId || ""),
      visaType:
        formData.visaType && visaOptions[formData.visaType]
          ? String(visaOptions[formData.visaType].visaTypeId)
          : String(formData.visaType || ""),
      name: String(formData.name || ""),
      phone: String(formData.phone || ""),
      email: String(formData.email || ""),
      familyCount: formData.familyCount, // kept as number per the model
      visaPurpose: String(formData.visaPurpose || ""),
      familyMembers: formData.familyMembers.map((member) => ({
        familyName: String(member.familyName || ""),
        familyWebId: String(member.familyWebId || ""),
      })),
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Form successfully stored in DB:", result);
        setSuccessMessage(true);
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
      familyCount: 0,
      visaPurpose: "",
      familyMembers: [],
    });

    onClose();
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
          width: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
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
          {/* Center Name */}
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

          {/* IVAC Name */}
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

          {/* Web ID */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Web ID"
              name="webId"
              value={formData.webId}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Visa Type */}
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

          {/* Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Family Count */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="familyCount">Family Count</InputLabel>
              <Select
                id="familyCount"
                name="familyCount"
                value={formData.familyCount}
                onChange={handleInputChange}
              >
                {[0, 1, 2, 3, 4].map((count) => (
                  <MenuItem key={count} value={count}>
                    {count}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Visa Purpose */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Visa Purpose"
              name="visaPurpose"
              value={formData.visaPurpose}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Dynamic Family Member Fields */}
          {formData.familyCount > 0 &&
            formData.familyMembers.map((member, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Family ${index + 1} Name`}
                    value={member.familyName}
                    onChange={(e) =>
                      handleFamilyMemberChange(
                        index,
                        "familyName",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Family ${index + 1} Webfile No`}
                    value={member.familyWebId}
                    onChange={(e) =>
                      handleFamilyMemberChange(
                        index,
                        "familyWebId",
                        e.target.value
                      )
                    }
                  />
                </Grid>
              </React.Fragment>
            ))}

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
