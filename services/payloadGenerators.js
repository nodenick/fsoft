// export const createApInfoPayload = (selectedUser) => {
//   console.log(selectedUser);
//   return {
//     _token: localStorage.getItem("token") || "",
//     highcom: selectedUser.highcom || "",
//     webfile_id: selectedUser.webId || "",
//     webfile_id_repeat: selectedUser.webId || "",
//     ivac_id: selectedUser.ivacName || "",
//     visa_type: selectedUser.visaType || "",
//     family_count: String(selectedUser.familyCount || "0"),
//     visit_purpose: selectedUser.visaPurpose || "",
//   };
// };

// export const createPerInfoPayload = (selectedUser) => {
//   // Build base payload
//   const payload = {
//     _token: localStorage.getItem("token") || "",
//     full__name: selectedUser.name || "",
//     email_name: selectedUser.email || "",
//     pho_ne: selectedUser.phone || "",
//     web_file_id: selectedUser.webId || "",
//   };

//   // If family members exist, add them to the payload
//   if (selectedUser.familyMembers && selectedUser.familyMembers.length > 0) {
//     selectedUser.familyMembers.forEach((member, index) => {
//       const idx = index + 1; // keys start from 1
//       payload[`family[${idx}][name]`] = member.familyName || "";
//       payload[`family[${idx}][webfile_no]`] = member.familyWebId || "";
//       payload[`family[${idx}][again_webfile_no]`] = member.familyWebId || "";
//     });
//   }

//   return payload;
// };

// // // For family info, we’re sending only the first family member’s info.
// // "family[1][name]":
// //   selectedUser.familyMembers && selectedUser.familyMembers.length > 0
// //     ? selectedUser.familyMembers[0].familyName
// //     : "",
// // "family[1][webfile_no]":
// //   selectedUser.familyMembers && selectedUser.familyMembers.length > 0
// //     ? selectedUser.familyMembers[0].familyWebId
// //     : "",
// // "family[1][again_webfile_no]":
// //   selectedUser.familyMembers && selectedUser.familyMembers.length > 0
// //     ? selectedUser.familyMembers[0].familyWebId
// //     : "",

// export const createOverviewPayload = () => {
//   return {
//     _token: localStorage.getItem("token") || "",
//   };
// };

// export const createSendOtpPayload = () => {
//   return {
//     _token: localStorage.getItem("token") || "",
//     resend: "0", // Always 0 as per your requirements
//   };
// };

// export const createVerifyOtpPayload = (otp) => {
//   return {
//     _token: localStorage.getItem("token") || "",
//     otp: otp,
//   };
// };

// export const createSlotTimePayload = (appointment_date) => {
//   return {
//     _token: localStorage.getItem("token") || "",
//     appointment_date: appointment_date || "",
//   };
// };

// export const createPayNowPayload = (
//   appointment_date,
//   appointment_time,
//   hash_param
// ) => {
//   return {
//     _token: localStorage.getItem("token") || "",
//     appointment_date: appointment_date || "",
//     appointment_time: appointment_time || "",
//     hash_param: hash_param || "",
//   };
// };

// payloadCreators.js

/**
 * Retrieves the API token from localStorage.
 * @returns {string} The API token.
 */
const getLocalToken = () => localStorage.getItem("token") || "";

/**
 * Retrieves the XSRF token from localStorage.
 * @returns {string} The XSRF token.
 */
const getXsrfToken = () => localStorage.getItem("xsrf_token") || "";

/**
 * Retrieves the ivac_session token from localStorage.
 * @returns {string} The ivac_session token.
 */
const getIvacSession = () => localStorage.getItem("ivac_session") || "";

/**
 * Builds the cookie string in the desired format.
 * Format: "XSRF-TOKEN=<xsrfToken>;ivac_session=<ivacSession>"
 * @param {string} xsrfToken - The XSRF token.
 * @param {string} ivacSession - The ivac_session token.
 * @returns {string} The formatted cookie string.
 */
const buildCookieString = (xsrfToken, ivacSession) => {
  return `XSRF-TOKEN=${xsrfToken};ivac_session=${ivacSession}`;
};

/**
 * Retrieves common tokens from localStorage.
 * @returns {object} An object containing the API token (_token), XSRF token (xsrf_token), and cookie.
 */
const getCommonTokens = () => {
  const _token = getLocalToken();
  const xsrfToken = getXsrfToken();
  const ivacSession = getIvacSession();
  const cookie = buildCookieString(xsrfToken, ivacSession);
  return { _token, xsrf_token: xsrfToken, cookie };
};

/**
 * Creates the payload for the Application Info endpoint.
 * Common tokens are included: _token, xsrf_token, and cookie.
 * @param {Object} selectedUser - The selected user data.
 * @returns {Object} The payload for the application info endpoint.
 */
export const createApInfoPayload = (selectedUser) => {
  return {
    ...getCommonTokens(),
    highcom: selectedUser.highcom || "",
    webfile_id: selectedUser.webId || "",
    webfile_id_repeat: selectedUser.webId || "",
    ivac_id: selectedUser.ivacName || "",
    visa_type: selectedUser.visaType || "",
    family_count: String(selectedUser.familyCount || "0"),
    visit_purpose: selectedUser.visaPurpose || "",
  };
};

/**
 * Creates the payload for the Personal Information endpoint.
 * Common tokens are included.
 * If family members exist, their details are appended with appropriate keys.
 * @param {Object} selectedUser - The selected user data.
 * @returns {Object} The payload for the personal info endpoint.
 */
export const createPerInfoPayload = (selectedUser) => {
  // Base payload with common tokens
  const payload = {
    ...getCommonTokens(),
    full__name: selectedUser.name || "",
    email_name: selectedUser.email || "",
    pho_ne: selectedUser.phone || "",
    web_file_id: selectedUser.webId || "",
  };

  // Append family member details if available
  if (
    Array.isArray(selectedUser.familyMembers) &&
    selectedUser.familyMembers.length > 0
  ) {
    selectedUser.familyMembers.forEach((member, index) => {
      const idx = index + 1; // keys start from 1
      payload[`family[${idx}][name]`] = member.familyName || "";
      payload[`family[${idx}][webfile_no]`] = member.familyWebId || "";
      payload[`family[${idx}][again_webfile_no]`] = member.familyWebId || "";
    });
  }

  return payload;
};

/**
 * Creates the payload for the Overview endpoint.
 * @returns {Object} The overview payload.
 */
export const createOverviewPayload = () => {
  return { ...getCommonTokens() };
};

/**
 * Creates the payload for sending an OTP.
 * @returns {Object} The payload for sending an OTP.
 */
export const createSendOtpPayload = () => {
  return {
    ...getCommonTokens(),
    resend: "0", // Always "0" as per your requirements.
  };
};

/**
 * Creates the payload for verifying an OTP.
 * @param {string} otp - The OTP entered by the user.
 * @returns {Object} The payload for OTP verification.
 */
export const createVerifyOtpPayload = (otp) => {
  return {
    ...getCommonTokens(),
    otp,
  };
};

/**
 * Creates the payload for fetching available slot times.
 * @param {string} appointment_date - The appointment date.
 * @returns {Object} The slot time payload.
 */
export const createSlotTimePayload = (appointment_date) => {
  return {
    ...getCommonTokens(),
    appointment_date: appointment_date || "",
  };
};

/**
 * Creates the payload for the "Pay Now" action.
 * @param {string} appointment_date - The appointment date.
 * @param {string} appointment_time - The appointment time.
 * @param {string} hash_param - The hash parameter.
 * @returns {Object} The pay now payload.
 */
export const createPayNowPayload = (
  appointment_date,
  appointment_time,
  hash_param
) => {
  return {
    ...getCommonTokens(),
    appointment_date: appointment_date || "",
    appointment_time: appointment_time || "",
    hash_param: hash_param || "",
  };
};
