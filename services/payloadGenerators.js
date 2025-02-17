export const createApInfoPayload = (selectedUser) => {
  return {
    _token: localStorage.getItem("token") || "",
    highcom: selectedUser.cName || "",
    webfile_id: selectedUser.webId || "",
    webfile_id_repeat: selectedUser.webId || "",
    ivac_id: selectedUser.ivacName || "",
    visa_type: selectedUser.visaType || "",
    family_count: String(selectedUser.familyCount || "0"),
    visit_purpose: selectedUser.visaPurpose || "",
  };
};

export const createPerInfoPayload = (selectedUser) => {
  return {
    _token: localStorage.getItem("token") || "",
    full__name: selectedUser.name || "",
    email_name: selectedUser.email || "",
    pho_ne: selectedUser.phone || "",
    // For family info, we’re sending only the first family member’s info.
    "family[1][name]":
      selectedUser.familyMembers && selectedUser.familyMembers.length > 0
        ? selectedUser.familyMembers[0].familyName
        : "",
    "family[1][webfile_no]":
      selectedUser.familyMembers && selectedUser.familyMembers.length > 0
        ? selectedUser.familyMembers[0].familyWebId
        : "",
    "family[1][again_webfile_no]":
      selectedUser.familyMembers && selectedUser.familyMembers.length > 0
        ? selectedUser.familyMembers[0].familyWebId
        : "",
  };
};

export const createOverviewPayload = () => {
  return {
    _token: localStorage.getItem("token") || "",
  };
};

export const createSendOtpPayload = () => {
  return {
    _token: localStorage.getItem("token") || "",
    resend: "0", // Always 0 as per your requirements
  };
};

export const createVerifyOtpPayload = (otp) => {
  return {
    _token: localStorage.getItem("token") || "",
    otp: otp,
  };
};

export const createSlotTimePayload = (appointment_date) => {
  return {
    _token: localStorage.getItem("token") || "",
    appointment_date: appointment_date || "",
  };
};

export const createPayNowPayload = (
  appointment_date,
  appointment_time,
  hash_param
) => {
  return {
    _token: localStorage.getItem("token") || "",
    appointment_date: appointment_date || "",
    appointment_time: appointment_time || "",
    hash_param: hash_param || "",
  };
};
