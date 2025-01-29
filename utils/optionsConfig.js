// optionsConfig.js

export const centerOptions = {
  Rajshahi: {
    ivacId: 2,
    centerId: 3,
    prefix: "R",
    address:
      "Morium Ali Tower,Holding No-18, Plot No-557, 1ST Floor,Old Bilsimla, Greater Road,Barnali More, 1ST Floor, Ward No-10,Rajshahi.",
  },
  Dhaka: {
    ivacId: 17,
    centerId: 1,
    prefix: "D",
    address: "Jamuna Future Park",
  },
  Chittagong: {
    ivacId: 5,
    centerId: 2,
    prefix: "C",
    address:
      "2111, Zakir Hossain Road, Habib Lane,Opposite Holy Crescent Hospital, Chittaghong",
  },
  Sylhet: {
    ivacId: 5,
    centerId: 4,
    prefix: "S",
    address: "456 Sylhet Road, Sylhet.",
  },
  Khulna: {
    ivacId: 6,
    centerId: 5,
    prefix: "K",
    address: "123 Khulna Road, Khulna.",
  },
};

export const visaOptions = {
  "ENTRY VISA": { visaTypeId: 6, visaOrder: 5 },
  "TOURIST VISA": { visaTypeId: 1, visaOrder: 1 },
  "MEDICAL/MEDICAL ATTENDANT VISA": { visaTypeId: 13, visaOrder: 2 },
  "BUSINESS VISA": { visaTypeId: 3, visaOrder: 3 },
  "STUDENT VISA": { visaTypeId: 2, visaOrder: 6 },
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
