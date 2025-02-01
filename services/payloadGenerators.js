// services/payloadGenerators.js

/**
 * Prepare the payload for sending OTP.
 */
export function createSendOtpPayload(user) {
  return {
    action: "sendOtp",
    resend: 0,
    info: [
      {
        web_id: user.web_id,
        web_id_repeat: user.web_id,
        passport: user.passport || "",
        name: user.name,
        phone: user.phone,
        email: user.email,
        amount: user.amount || "800.00",
        captcha: user.captcha || "",
        center: {
          id: user.center?.id,
          c_name: user.center?.c_name,
          prefix: user.center?.prefix,
          is_delete: user.center?.is_delete || 0,
        },
        is_open: user.is_open,
        ivac: {
          id: user.ivac?.id,
          center_info_id: user.ivac?.center_info_id,
          ivac_name: user.ivac?.ivac_name,
          address: user.ivac?.address,
          prefix: user.ivac?.prefix,
          charge: user.ivac?.charge,
          new_visa_fee: user.ivac?.new_visa_fee,
        },
        visa_type: {
          id: user.visa_type?.id,
          type_name: user.visa_type?.type_name,
          is_active: user.visa_type?.is_active,
        },
        confirm_tos: user.confirm_tos || true,
      },
    ],
  };
}

/**
 * Prepare the payload for verifying OTP.
 */
export function createVerifyOtpPayload(user, otp) {
  if (otp == null) {
    // Show an alert notifying that the process has been stopped.
    alert("Process stopped.");
    // Throw an error to prevent further processing.
    throw new Error("Process stopped.");
  }
  return {
    action: "verifyOtp",
    otp: otp.toString(),
    info: [
      {
        web_id: user.web_id?.toString() || "",
        web_id_repeat: user.web_id?.toString() || "",
        passport: user.passport || "",
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        amount: (user.amount || "800.00").toString(),
        captcha: "",
        center: {
          id: user.center?.id || 0,
          c_name: user.center?.c_name || "",
          prefix: user.center?.prefix || "",
          is_delete: user.center?.is_delete || 0,
          created_by: "",
          created_at: "",
          updated_at: "",
        },
        is_open: user.is_open?.toString() || "1",
        ivac: {
          id: user.ivac?.id || 0,
          center_info_id: user.ivac?.center_info_id || 0,
          ivac_name: user.ivac?.ivac_name || "",
          address: user.ivac?.address || "",
          prefix: user.ivac?.prefix || "",
          ceated_on: "", // match your backend naming
          visa_fee: (user.ivac?.visa_fee || "800.00").toString(),
          charge: user.ivac?.charge || 3,
          new_visa_fee: (user.ivac?.new_visa_fee || "800.00").toString(),
          old_visa_fee: (user.ivac?.old_visa_fee || "800.00").toString(),
          new_fees_applied_from: "",
          notify_fees_from: "",
          max_notification_count: 0,
          allow_old_amount_until_new_date: 0,
          notification_text_beside_amount: "",
          notification_text_popup: "",
          is_delete: user.ivac?.is_delete || 0,
        },
        amountChangeData: {
          allow_old_amount_until_new_date: 0,
          max_notification_count: 0,
          old_visa_fees: "string",
          new_fees_applied_from: "string",
          notice: "string",
          notice_short: "",
          notice_popup: "",
          new_visa_fee: "string",
        },
        visa_type: {
          id: user.visa_type?.id || 0,
          type_name: user.visa_type?.type_name || "",
          order: 0,
          is_active: 0,
          $$hashKey: "",
        },
        confirm_tos: "true",
        otp: otp.toString(),
      },
    ],
  };
}

/**
 * Prepare the payload for getting appointment times (generateSlotTime).
 */
export function createGetAppointmentTimePayload(user, otp, specificDate) {
  return {
    action: "generateSlotTime",
    amount: (user.amount || "800.00").toString(),
    ivac_id: user.ivac?.id || 0,
    visa_type: user.visa_type?.id || 0,
    specific_date: specificDate || "",
    info: [
      {
        web_id: user.web_id?.toString() || "",
        web_id_repeat: user.web_id?.toString() || "",
        passport: user.passport || "",
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        amount: (user.amount || "800.00").toString(),
        captcha: "",
        center: {
          id: user.center?.id || 0,
          c_name: user.center?.c_name || "",
          prefix: user.center?.prefix || "",
          is_delete: user.center?.is_delete || 0,
        },
        is_open: user.is_open?.toString() || "1",
        ivac: {
          id: user.ivac?.id || 0,
          center_info_id: user.ivac?.center_info_id || 0,
          ivac_name: user.ivac?.ivac_name || "",
          address: user.ivac?.address || "",
          prefix: user.ivac?.prefix || "",
          charge: user.ivac?.charge || 3,
          new_visa_fee: (user.ivac?.new_visa_fee || "800.00").toString(),
          old_visa_fee: (user.ivac?.old_visa_fee || "").toString(),
          is_delete: user.ivac?.is_delete || 0,
        },
        amountChangeData: {
          allow_old_amount_until_new_date: 0,
          max_notification_count: 0,
          old_visa_fees: (user.ivac?.old_visa_fee || "800.00").toString(),
          new_fees_applied_from: "",
          notice: "false",
          notice_short: "",
          notice_popup: "",
          new_visa_fee: (user.ivac?.new_visa_fee || "800.00").toString(),
        },
        visa_type: {
          id: user.visa_type?.id || 0,
          type_name: user.visa_type?.type_name || "",
          is_active: 0,
          order: 0,
        },
        confirm_tos: "true",
        otp: otp.toString(),
        appointment_time: specificDate.toString(),
      },
    ],
  };
}

/**
 * Prepare the payload for final payment request (paynow).
 */
export function createPayInvoicePayload(user, otp, chosenSlot, hashParams) {
  return {
    action: "paynow",
    info: [
      {
        web_id: user.web_id?.toString() || "",
        web_id_repeat: user.web_id?.toString() || "",
        passport: user.passport || "",
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        amount: (user.amount || "800.00").toString(),
        captcha: "", // assuming captcha is handled elsewhere if needed
        center: {
          id: user.center?.id || 0,
          c_name: user.center?.c_name || "",
          prefix: user.center?.prefix || "",
          is_delete: 0,
          created_by: "",
          created_at: "",
          updated_at: "",
        },
        is_open: user.is_open?.toString() || "true",
        ivac: {
          id: user.ivac?.id || 0,
          center_info_id: user.ivac?.center_info_id || 0,
          ivac_name: user.ivac?.ivac_name || "",
          address: user.ivac?.address || "",
          prefix: user.ivac?.prefix || "",
          created_on: "",
          visa_fee: (user.ivac?.visa_fee || "800.00").toString(),
          charge: user.ivac?.charge || 3,
          new_visa_fee: (user.ivac?.new_visa_fee || "800.00").toString(),
          old_visa_fee: user.ivac?.old_visa_fee || "",
          is_delete: 0,
          created_at: "",
          updated_at: "",
          app_key: "",
          contact_number: "",
          created_by: "",
          new_fees_applied_from: "",
          notify_fees_from: "",
          max_notification_count: 0,
          allow_old_amount_until_new_date: 0,
          notification_text_beside_amount: "",
          notification_text_popup: "",
        },
        amountChangeData: {
          new_visa_fee: (user.ivac?.new_visa_fee || "800.00").toString(),
        },
        visa_type: {
          id: user.visa_type?.id || 0,
          type_name: user.visa_type?.type_name || "",
          is_active: 0,
          order: 0,
          $$hashKey: "",
        },
        confirm_tos: "true",
        otp: otp.toString(),
        appointment_time: chosenSlot.date?.toString() || "",
      },
    ],
    selected_payment: {
      name: "Bkash",
      slug: "bkash",
      grand_total: 824, // Assumed static or calculate as needed
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
    },
    selected_slot: {
      id: chosenSlot.id || 0,
      ivac_id: chosenSlot.ivac_id || 0,
      visa_type: chosenSlot.visa_type || 0,
      hour: chosenSlot.hour || 0,
      date: chosenSlot.date?.toString() || "",
      availableSlot: chosenSlot.availableSlot || 0,
      time_display: chosenSlot.time_display?.toString() || "",
    },
    hash_params: hashParams.toString() || "", // Passing hash_params as a top-level key
  };
}
