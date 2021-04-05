//REQUEST
const request_insert =
  "INSERT INTO tblrequest ( userID, certificateID, paymentid, purpose, statusID, r_date, r_time ) " +
  "VALUES ( ? , ( SELECT certificateID FROM tblcertificates WHERE certificateName = ? ), " +
  "( SELECT paymentid FROM tblpayment WHERE payment = ? ), ? , " +
  "( SELECT statusID FROM tblstatus WHERE STATUS = ? ), NOW(), NOW())";

module.exports = {
  request_insert,
};
