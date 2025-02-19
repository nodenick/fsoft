// utils/optionsConfig.js

export const centerOptions = {
  Rajshahi: {
    ivacId: 2,
  },
  Dhaka: {
    ivacId: 17,
  },
  Chittagong: {
    ivacId: 5,
  },
  Sylhet: {
    ivacId: 5,
  },
  Khulna: {
    ivacId: 3,
  },
};

export const visaOptions = {
  "ENTRY VISA": { visaTypeId: 6 },
  "TOURIST VISA": { visaTypeId: 1 },
  "MEDICAL/MEDICAL ATTENDANT VISA": { visaTypeId: 13 },
  "BUSINESS VISA": { visaTypeId: 3 },
  "STUDENT VISA": { visaTypeId: 2 },
};

export const highcom = {
  Dhaka: "1",
  Chittagong: "2",
  Sylhet: "3",
  Khulna: "4",
  Rajshahi: "3",
};

// New mapping for IVAC centers based on IVAC name dropdown options.
export const ivacOptions = {
  "IVAC, RAJSHAHI": "2",
  "IVAC, KHULNA": "3",
  "IVAC, SYLHET": "5",
  "IVAC, CHITTAGONG": "5",
  "IVAC, Dhaka (JFP)": "17",
};

// Payment Methods Configuration
export const paymentMethods = {
  cards: [
    {
      name: "VISA",
      slug: "visacard",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/visa.png",
    },
    {
      name: "MASTER",
      slug: "mastercard",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/master.png",
    },
    {
      name: "AMEX",
      slug: "city_amex",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/amex.png",
    },
  ],
  others: [
    {
      name: "NEXUS",
      slug: "dbbl_nexus",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/dbblnexus.png",
    },
  ],
  internet: [
    {
      name: "CITYTOUCH",
      slug: "city",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/citytouch.png",
    },
    {
      name: "BANK ASIA",
      slug: "bankasia",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bankasia.png",
    },
    {
      name: "IBBL",
      slug: "ibbl",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/ibbl.png",
    },
    {
      name: "MTBL",
      slug: "mtbl",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/mtbl.png",
    },
    {
      name: "Upay",
      slug: "upay",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/upay.png",
    },
    {
      name: "AB Direct",
      slug: "abdirect",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/abbank.png",
    },
    {
      name: "Tapnpay",
      slug: "tapnpay",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/tapnpay.png",
    },
  ],
  mobile: [
    {
      name: "DBBL MOBILE BANKING",
      slug: "dbblmobilebanking",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/dbblmobilebank.png",
    },
    {
      name: "Bkash",
      slug: "bkash",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
    },
    {
      name: "MYCASH",
      slug: "mycash",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/mycash.png",
    },
    {
      name: "Nagad",
      slug: "nagad",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/nagad.png",
    },
    {
      name: "Mobile Money",
      slug: "mobilemoney",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/mobilemoney.png",
    },
    {
      name: "Okwallet",
      slug: "okwallet",
      link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/okwallet.png",
    },
  ],
};
