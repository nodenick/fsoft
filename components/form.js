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

// import React, { useState } from "react";
// import {
//   centerOptions,
//   visaOptions,
//   paymentMethods,
// } from "../utils/optionsConfig";

// const FormComponent = ({ isOpen, onClose }) => {
//   // Do not render if the modal is not open.
//   if (!isOpen) return null;

//   // API URL (adjust as needed)
//   const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/store-form`;

//   // Common details shared by all persons, including the payment method.
//   const [commonData, setCommonData] = useState({
//     cName: "",
//     ivacName: "",
//     visaType: "",
//     phone: "",
//     email: "",
//     paymentMethod: "",
//   });

//   // Persons array – only Web ID and Name differ per person.
//   const [persons, setPersons] = useState([{ webId: "", name: "" }]);
//   const [successMessage, setSuccessMessage] = useState(false);

//   // Handle changes for common fields.
//   const handleCommonChange = (e) => {
//     const { name, value } = e.target;
//     setCommonData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle changes for each person’s Web ID and Name.
//   const handlePersonChange = (index, e) => {
//     const { name, value } = e.target;
//     const newPersons = [...persons];
//     newPersons[index][name] = value;
//     setPersons(newPersons);
//   };

//   // Add a new person entry.
//   const addPerson = () => {
//     setPersons([...persons, { webId: "", name: "" }]);
//   };

//   // Remove a person entry if more than one exists.
//   const removePerson = (index) => {
//     if (persons.length > 1) {
//       const newPersons = persons.filter((_, i) => i !== index);
//       setPersons(newPersons);
//     }
//   };

//   // Handle form submission.
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate common fields.
//     if (
//       !commonData.cName ||
//       !commonData.visaType ||
//       !commonData.paymentMethod
//     ) {
//       alert(
//         "Please select a valid Center Name, Visa Type, and Payment Method."
//       );
//       return;
//     }

//     // Validate each person’s unique fields.
//     for (let i = 0; i < persons.length; i++) {
//       if (!persons[i].webId || !persons[i].name) {
//         alert(`Please fill in both Web ID and Name for person ${i + 1}.`);
//         return;
//       }
//     }

//     // Look up the selected center and visa details from optionsConfig.
//     const selectedCenter = centerOptions[commonData.cName];
//     const selectedVisa = visaOptions[commonData.visaType];

//     if (!selectedCenter || !selectedVisa) {
//       alert("Invalid Center or Visa Type selection.");
//       return;
//     }

//     // Determine the selected payment method object.
//     let selectedPaymentMethod = null;
//     Object.values(paymentMethods).forEach((category) => {
//       category.forEach((method) => {
//         if (method.slug === commonData.paymentMethod) {
//           selectedPaymentMethod = method;
//         }
//       });
//     });
//     if (!selectedPaymentMethod) {
//       alert("Please select a valid Payment Method.");
//       return;
//     }

//     // Build the request payload.
//     const payload = {
//       action: "sendOtp",
//       resend: 0,
//       info: persons.map((person) => ({
//         web_id: person.webId,
//         web_id_repeat: person.webId,
//         name: person.name,
//         phone: commonData.phone,
//         email: commonData.email,
//         amount: "800.00",
//         center: {
//           id: selectedCenter.centerId,
//           c_name: commonData.cName,
//           prefix: selectedCenter.prefix,
//           is_delete: 0,
//         },
//         is_open: true,
//         ivac: {
//           id: selectedCenter.ivacId,
//           center_info_id: selectedCenter.centerId,
//           ivac_name: commonData.ivacName,
//           address: selectedCenter.address,
//           prefix: selectedCenter.prefix,
//           charge: 3,
//           new_visa_fee: 800.0,
//         },
//         visa_type: {
//           id: selectedVisa.visaTypeId,
//           type_name: commonData.visaType,
//           order: selectedVisa.visaOrder,
//           is_active: 1,
//         },
//         // Add the payment method details here.
//         payment_method: {
//           slug: selectedPaymentMethod.slug,
//           link: selectedPaymentMethod.link,
//         },
//         confirm_tos: true,
//       })),
//     };

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log("Form successfully stored:", result);
//         setSuccessMessage(true);
//       } else {
//         const error = await response.json();
//         console.error("Error storing form:", error);
//         alert("Failed to store form data. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error during API call:", err);
//       alert("An unexpected error occurred. Please try again.");
//     }

//     // Reset form fields.
//     setCommonData({
//       cName: "",
//       ivacName: "",
//       visaType: "",
//       phone: "",
//       email: "",
//       paymentMethod: "",
//     });
//     setPersons([{ webId: "", name: "" }]);
//     if (onClose) onClose();
//   };

//   return (
//     <div className="formComponent">
//       <div className="modal-overlay">
//         <div className="modal">
//           <button
//             className="close-btn"
//             onClick={onClose}
//             aria-label="Close Modal"
//           >
//             &times;
//           </button>
//           <h2>Enter Webfile Details</h2>
//           <form onSubmit={handleSubmit}>
//             <fieldset className="common-fields">
//               <legend>Common Details</legend>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="cName">Center Name</label>
//                   <select
//                     name="cName"
//                     id="cName"
//                     value={commonData.cName}
//                     onChange={handleCommonChange}
//                     required
//                   >
//                     <option value="">Select a Center</option>
//                     {Object.keys(centerOptions).map((key) => (
//                       <option key={key} value={key}>
//                         {key}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="ivacName">IVAC Name</label>
//                   <select
//                     name="ivacName"
//                     id="ivacName"
//                     value={commonData.ivacName}
//                     onChange={handleCommonChange}
//                   >
//                     <option value="">Select an IVAC Center</option>
//                     <option value="IVAC, RAJSHAHI">IVAC, RAJSHAHI</option>
//                     <option value="IVAC, KHULNA">IVAC, KHULNA</option>
//                     <option value="IVAC, SYLHET">IVAC, SYLHET</option>
//                     <option value="IVAC, CHITTAGONG">IVAC, CHITTAGONG</option>
//                     <option value="IVAC, Dhaka (JFP)">IVAC, Dhaka (JFP)</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="visaType">Visa Type</label>
//                   <select
//                     name="visaType"
//                     id="visaType"
//                     value={commonData.visaType}
//                     onChange={handleCommonChange}
//                     required
//                   >
//                     <option value="">Select a Visa Type</option>
//                     {Object.keys(visaOptions).map((key) => (
//                       <option key={key} value={key}>
//                         {key}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="phone">Phone</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     id="phone"
//                     value={commonData.phone}
//                     onChange={handleCommonChange}
//                     placeholder="Enter phone"
//                   />
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group full-width">
//                   <label htmlFor="email">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     id="email"
//                     value={commonData.email}
//                     onChange={handleCommonChange}
//                     placeholder="Enter email"
//                   />
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group full-width">
//                   <label htmlFor="paymentMethod">Payment Method</label>
//                   <select
//                     name="paymentMethod"
//                     id="paymentMethod"
//                     value={commonData.paymentMethod}
//                     onChange={handleCommonChange}
//                     required
//                   >
//                     <option value="">Select a Payment Method</option>
//                     <optgroup label="Cards">
//                       {paymentMethods.cards.map((method) => (
//                         <option key={method.slug} value={method.slug}>
//                           {method.name}
//                         </option>
//                       ))}
//                     </optgroup>
//                     <optgroup label="Others">
//                       {paymentMethods.others.map((method) => (
//                         <option key={method.slug} value={method.slug}>
//                           {method.name}
//                         </option>
//                       ))}
//                     </optgroup>
//                     <optgroup label="Internet Banking">
//                       {paymentMethods.internet.map((method) => (
//                         <option key={method.slug} value={method.slug}>
//                           {method.name}
//                         </option>
//                       ))}
//                     </optgroup>
//                     <optgroup label="Mobile Banking">
//                       {paymentMethods.mobile.map((method) => (
//                         <option key={method.slug} value={method.slug}>
//                           {method.name}
//                         </option>
//                       ))}
//                     </optgroup>
//                   </select>
//                 </div>
//               </div>
//             </fieldset>

//             <fieldset className="person-fields">
//               <legend>Persons Details</legend>
//               {persons.map((person, index) => (
//                 <div key={index} className="person-entry">
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label htmlFor={`webId-${index}`}>Web ID</label>
//                       <input
//                         type="text"
//                         name="webId"
//                         id={`webId-${index}`}
//                         value={person.webId}
//                         onChange={(e) => handlePersonChange(index, e)}
//                         placeholder="Enter Web ID"
//                         required
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label htmlFor={`name-${index}`}>Name</label>
//                       <input
//                         type="text"
//                         name="name"
//                         id={`name-${index}`}
//                         value={person.name}
//                         onChange={(e) => handlePersonChange(index, e)}
//                         placeholder="Enter Name"
//                         required
//                       />
//                     </div>
//                   </div>
//                   {persons.length > 1 && (
//                     <button
//                       type="button"
//                       className="remove-btn"
//                       onClick={() => removePerson(index)}
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button type="button" className="add-btn" onClick={addPerson}>
//                 + Add Person
//               </button>
//             </fieldset>
//             <button type="submit" className="submit-btn">
//               Submit
//             </button>
//           </form>
//           {successMessage && (
//             <p className="success-msg">Form added successfully!</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormComponent;
